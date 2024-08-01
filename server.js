const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
const db = new sqlite3.Database('./online_store_db.sqlite');

const sessionStore = new SQLiteStore();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    key: 'session_cookie_name',
    secret: '123',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: null } // MaxAge will be set dynamically
}));

app.use(express.static('build'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
});

app.route('/items')
    .get((req, res) => {
        const { search } = req.query;
        if (search) {
            searchItems(search, res);
        } else {
            getAllItems(res);
        }
    });

function getAllItems(res) {
    const query = "SELECT id, name, description, price, stock, image_url, created_at FROM items";
    db.all(query, [], (error, results) => {
        if (error) throw error;
        res.json(results.map(r => ({
            ...r,
            created_at: r.created_at.replace('T', ' ').substr(0, 19)
        })));
    });
}

function searchItems(search, res) {
    const query = "SELECT id, name, description, price, stock, image_url, created_at FROM items WHERE name LIKE ? OR description LIKE ?";
    const searchTerm = `%${search}%`;
    db.all(query, [searchTerm, searchTerm], (error, results) => {
        if (error) throw error;
        res.json(results.map(r => ({
            ...r,
            created_at: r.created_at.replace('T', ' ').substr(0, 19)
        })));
    });
}

app.get('/items/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT id, name, description, price, stock, image_url, created_at FROM items WHERE id = ?";
    db.get(query, [id], (error, result) => {
        if (error) throw error;
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    });
});

app.post('/add-item', (req, res) => {
    const { name, description, price, stock, image_url } = req.body;

    if (!req.session.user_id || req.session.username !== 'admin') {
        return res.status(403).json({ message: 'Only admin can add items' });
    }

    const query = "INSERT INTO items (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)";
    db.run(query, [name, description, price, stock, image_url], function(error) {
        if (error) {
            res.status(500).json({ error: 'Error adding item' });
            throw error;
        }
        res.json({ message: 'Item added successfully', new_item_id: this.lastID });
    });
});

app.post('/signup', (req, res) => {
    const { username, password, created_at } = req.body;
    const query = "SELECT username FROM users WHERE username = ?";
    db.get(query, [username], (error, result) => {
        if (error) {
            res.status(500).json({ message: "Error executing query" });
            return;
        }
        if (result) {
            res.status(400).json({ message: "Username already exists" });
        } else {
            const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
            const insertQuery = "INSERT INTO users (username, created_at, password) VALUES (?, ?, ?)";
            db.run(insertQuery, [username, created_at, hashedPassword], function(err) {
                if (err) {
                    res.status(500).json({ message: "Error inserting user" });
                    return;
                }
                res.sendStatus(201);
            });
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password, rememberMe } = req.body;
    const query = "SELECT id, username, password FROM users WHERE username = ?";
    db.get(query, [username], (error, user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user_id = user.id;
            req.session.username = user.username;

            if (rememberMe) {
                req.session.cookie.maxAge = 10 * 24 * 60 * 60 * 1000;
            } else {
                req.session.cookie.maxAge = 30 * 60 * 1000;
            }

            res.cookie('session_cookie_name', req.session.id, {
                maxAge: req.session.cookie.maxAge,
                httpOnly: true,
                secure: false
            });

            logActivity(user.id, username, 'login');

            res.json({ success: true });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.post('/logout', (req, res) => {
    const username = req.session.username;
    req.session.destroy();
    res.clearCookie("session_cookie_name");
    logActivity(null, username, 'logout');
    res.sendStatus(200);
});

function sessionCheck(req) {
    const sessionId = req.cookies.session_cookie_name;
    if (!sessionId) return null;
    return new Promise((resolve, reject) => {
        const query = "SELECT data FROM sessions WHERE session_id = ?";
        db.get(query, [sessionId], (error, result) => {
            if (error) reject(error);
            resolve(result ? result.data : null);
        });
    });
}

app.post('/cart/add', (req, res) => {
    const { item_id } = req.body;

    if (!req.session.user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const checkQuery = "SELECT quantity FROM cart WHERE user_id = ? AND item_id = ?";
    db.get(checkQuery, [req.session.user_id, item_id], (error, result) => {
        if (error) throw error;

        if (result) {
            const updateQuery = "UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND item_id = ?";
            db.run(updateQuery, [req.session.user_id, item_id], (error) => {
                if (error) throw error;
                logActivity(req.session.user_id, req.session.username, 'add-to-cart');
                res.json({ message: 'Item quantity updated successfully' });
            });
        } else {
            const insertQuery = "INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, 1)";
            db.run(insertQuery, [req.session.user_id, item_id], (error) => {
                if (error) throw error;
                logActivity(req.session.user_id, req.session.username, 'add-to-cart');
                res.json({ message: 'Item added to cart successfully' });
            });
        }
    });
});

app.get('/cart', (req, res) => {
    const user_id = req.session.user_id;

    if (!user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const query = `
        SELECT items.id, items.name, items.description, items.price, items.image_url, cart.quantity
        FROM cart
        JOIN items ON cart.item_id = items.id
        WHERE cart.user_id = ?
    `;
    db.all(query, [user_id], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.delete('/cart/:item_id', (req, res) => {
    const { item_id } = req.params;
    const { quantity } = req.body;
    const user_id = req.session.user_id;

    if (!user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const checkQuery = "SELECT quantity FROM cart WHERE user_id = ? AND item_id = ?";
    db.get(checkQuery, [user_id, item_id], (error, result) => {
        if (error) throw error;

        if (result && result.quantity > quantity) {
            const updateQuery = "UPDATE cart SET quantity = quantity - ? WHERE user_id = ? AND item_id = ?";
            db.run(updateQuery, [quantity, user_id, item_id], (error) => {
                if (error) throw error;
                res.json({ message: 'Item quantity updated successfully' });
            });
        } else {
            const deleteQuery = "DELETE FROM cart WHERE user_id = ? AND item_id = ?";
            db.run(deleteQuery, [user_id, item_id], (error) => {
                if (error) throw error;
                res.json({ message: 'Item removed from cart successfully' });
            });
        }
    });
});

app.delete('/items/:id', (req, res) => {
    const { id } = req.params;

    if (!req.session.user_id || req.session.username !== 'admin') {
        return res.status(403).json({ message: 'Only admin can delete items' });
    }

    const query = "DELETE FROM items WHERE id = ?";
    db.run(query, [id], (error) => {
        if (error) {
            res.status(500).json({ error: 'Error deleting item' });
            throw error;
        }
        res.json({ message: 'Item deleted successfully' });
    });
});

app.post('/checkout', (req, res) => {
    const user_id = req.session.user_id;

    if (!user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        const query = `
            SELECT items.id, items.name, items.price, items.stock, cart.quantity
            FROM cart
            JOIN items ON cart.item_id = items.id
            WHERE cart.user_id = ?
        `;
        db.all(query, [user_id], (error, cartItems) => {
            if (error) {
                db.run("ROLLBACK");
                throw error;
            }

            const totalAmount = cartItems.reduce((total, item) => {
                return total + item.price * item.quantity;
            }, 0);

            const orderQuery = "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)";
            db.run(orderQuery, [user_id, totalAmount], function(error) {
                if (error) {
                    db.run("ROLLBACK");
                    throw error;
                }

                const orderId = this.lastID;
                const orderItemsQuery = "INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)";

                cartItems.forEach(item => {
                    db.run(orderItemsQuery, [orderId, item.id, item.quantity], (error) => {
                        if (error) {
                            db.run("ROLLBACK");
                            throw error;
                        }
                    });
                });

                cartItems.forEach(item => {
                    const newStock = item.stock - item.quantity;
                    if (newStock < 0) {
                        db.run("ROLLBACK");
                        throw new Error(`Not enough stock for item: ${item.name}`);
                    }
                    const updateQuery = "UPDATE items SET stock = ? WHERE id = ?";
                    db.run(updateQuery, [newStock, item.id], (error) => {
                        if (error) {
                            db.run("ROLLBACK");
                            throw error;
                        }
                    });
                });

                const deleteQuery = "DELETE FROM cart WHERE user_id = ?";
                db.run(deleteQuery, [user_id], (error) => {
                    if (error) {
                        db.run("ROLLBACK");
                        throw error;
                    }

                    db.run("COMMIT");
                    res.json({ message: 'Checkout successful' });
                });
            });
        });
    });
});

app.get('/admin/activities', (req, res) => {
    const query = "SELECT * FROM activities ORDER BY datetime DESC";
    db.all(query, [], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

const logActivity = (user_id, username, type) => {
    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = "INSERT INTO activities (user_id, username, type, datetime) VALUES (?, ?, ?, ?)";
    db.run(query, [user_id, username, type, datetime], (error) => {
        if (error) throw error;
    });
};

app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, image_url } = req.body;

    const query = "UPDATE items SET name = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE id = ?";
    db.run(query, [name, description, price, stock, image_url, id], (error) => {
        if (error) {
            res.status(500).json({ error: 'Error updating item' });
            throw error;
        }
        res.json({ message: 'Item updated successfully' });
    });
});

app.post('/change-username', (req, res) => {
    const { newUsername } = req.body;

    if (!req.session.user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const checkQuery = "SELECT * FROM users WHERE username = ?";
    db.get(checkQuery, [newUsername], (error, result) => {
        if (result) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const updateQuery = "UPDATE users SET username = ? WHERE id = ?";
        db.run(updateQuery, [newUsername, req.session.user_id], (error) => {
            if (error) {
                return res.status(500).json({ message: 'Error updating username' });
            }

            req.session.username = newUsername;
            res.json({ message: 'Username updated successfully' });
        });
    });
});

app.get('/past-orders', (req, res) => {
    const user_id = req.session.user_id;

    if (!user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const query = `
        SELECT o.id, o.total_amount, o.created_at, oi.item_id, oi.quantity, i.name, i.price
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN items i ON oi.item_id = i.id
        WHERE o.user_id = ?
    `;
    db.all(query, [user_id], (error, results) => {
        if (error) throw error;

        const orders = {};
        results.forEach(row => {
            if (!orders[row.id]) {
                orders[row.id] = {
                    id: row.id,
                    total_amount: row.total_amount,
                    created_at: row.created_at,
                    items: []
                };
            }
            orders[row.id].items.push({
                item_id: row.item_id,
                name: row.name,
                price: row.price,
                quantity: row.quantity
            });
        });

        res.json(Object.values(orders));
    });
});

app.get('/wishlist', (req, res) => {
    const user_id = req.session.user_id;

    if (!user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const query = `
        SELECT w.id, w.item_id, i.name, i.price, i.image_url, w.created_at
        FROM wishlist w
        JOIN items i ON w.item_id = i.id
        WHERE w.user_id = ?
    `;
    db.all(query, [user_id], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/wishlist/add', (req, res) => {
    const user_id = req.session.user_id;
    const { item_id } = req.body;

    if (!user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const query = "INSERT INTO wishlist (user_id, item_id) VALUES (?, ?)";
    db.run(query, [user_id, item_id], (error) => {
        if (error) throw error;
        res.json({ message: 'Item added to wishlist' });
    });
});

app.delete('/wishlist/:id', (req, res) => {
    const user_id = req.session.user_id;
    const { id } = req.params;

    if (!user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const query = "DELETE FROM wishlist WHERE id = ? AND user_id = ?";
    db.run(query, [id, user_id], (error) => {
        if (error) throw error;
        res.json({ message: 'Item removed from wishlist' });
    });
});

app.get('/reviews', (req, res) => {
    const user_id = req.session.user_id;

    if (!user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const query = `
        SELECT r.id, r.item_id, i.name AS product_name, r.rating, r.comment, r.created_at
        FROM reviews r
        JOIN items i ON r.item_id = i.id
        WHERE r.user_id = ?
    `;
    db.all(query, [user_id], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/reviews/add', (req, res) => {
    const user_id = req.session.user_id;
    const { product_name, rating, comment } = req.body;

    if (!user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    // First, find the item_id by product_name (case-insensitive)
    const findItemQuery = "SELECT id FROM items WHERE LOWER(name) = LOWER(?)";
    db.get(findItemQuery, [product_name], (error, item) => {
        if (error) throw error;

        if (!item) {
            return res.status(400).json({ message: 'Product not found' });
        }

        const item_id = item.id;
        const insertReviewQuery = "INSERT INTO reviews (user_id, item_id, rating, comment) VALUES (?, ?, ?, ?)";
        db.run(insertReviewQuery, [user_id, item_id, rating, comment], function(error) {
            if (error) throw error;
            res.json({ message: 'Review added', insertId: this.lastID });
        });
    });
});

app.get('/reviews/:item_id', (req, res) => {
    const { item_id } = req.params;
    const query = `
        SELECT r.id, r.rating, r.comment, r.created_at, u.username
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.item_id = ?
    `;
    db.all(query, [item_id], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
