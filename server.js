const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);

const app = express();
//
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'online_store_db',
    connectionLimit: 5
});

const sessionStore = new MySQLStore({
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, pool);

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
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = "SELECT id, name, description, price, stock, image_url, created_at FROM items";
        connection.query(query, (error, results) => {
            connection.release();
            if (error) throw error;
            res.json(results.map(r => ({
                ...r,
                created_at: r.created_at.toISOString().replace('T', ' ').substr(0, 19)
            })));
        });
    });
}

function searchItems(search, res) {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = "SELECT id, name, description, price, stock, image_url, created_at FROM items WHERE name LIKE ? OR description LIKE ?";
        const searchTerm = `%${search}%`;
        connection.query(query, [searchTerm, searchTerm], (error, results) => {
            connection.release();
            if (error) throw error;
            res.json(results.map(r => ({
                ...r,
                created_at: r.created_at.toISOString().replace('T', ' ').substr(0, 19)
            })));
        });
    });
}

app.get('/items/:id', (req, res) => {
    const { id } = req.params;
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = "SELECT id, name, description, price, stock, image_url, created_at FROM items WHERE id = ?";
        connection.query(query, [id], (error, results) => {
            connection.release();
            if (error) throw error;
            if (results.length) {
                res.json(results[0]);
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        });
    });
});

app.post('/add-item', (req, res) => {
    const { name, description, price, stock, image_url } = req.body;

    if (!req.session.user_id || req.session.username !== 'admin') {
        return res.status(403).json({ message: 'Only admin can add items' });
    }

    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = "INSERT INTO items (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)";
        connection.query(query, [name, description, price, stock, image_url], (error, results) => {
            connection.release();
            if (error) {
                res.status(500).json({ error: 'Error adding item' });
                throw error;
            }
            res.json({ message: 'Item added successfully', new_item_id: results.insertId });
        });
    });
});

app.post('/signup', (req, res) => {
    const { username, password, created_at } = req.body;
    console.log("Signup Request Received:", req.body);
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Database Connection Error:", err);
            res.status(500).json({ message: "Database connection error" });
            return;
        }
        const query = "SELECT username FROM users WHERE username = ?";
        connection.query(query, [username], (error, results) => {
            if (error) {
                connection.release();
                console.error("Error Executing Query:", error);
                res.status(500).json({ message: "Error executing query" });
                return;
            }
            if (results.length) {
                connection.release();
                res.status(400).json({ message: "Username already exists" });
            } else {
                const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
                const insertQuery = "INSERT INTO users (username, created_at, password) VALUES (?, ?, ?)";
                connection.query(insertQuery, [username, created_at, hashedPassword], (err) => {
                    connection.release();
                    if (err) {
                        console.error("Error Inserting User:", err);
                        res.status(500).json({ message: "Error inserting user" });
                        return;
                    }
                    res.sendStatus(201);
                });
            }
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password, rememberMe } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = "SELECT id, username, password FROM users WHERE username = ?";
        connection.query(query, [username], (error, results) => {
            connection.release();
            if (results.length) {
                const user = results[0];
                if (bcrypt.compareSync(password, user.password)) {
                    req.session.user_id = user.id; // Store user ID in the session
                    req.session.username = user.username;

                    // Set session cookie expiration
                    if (rememberMe) {
                        req.session.cookie.maxAge = 10 * 24 * 60 * 60 * 1000; // 10 days
                    } else {
                        req.session.cookie.maxAge = 30 * 60 * 1000; // 30 minutes
                    }

                    // Set the cookie expiration explicitly
                    res.cookie('session_cookie_name', req.session.id, {
                        maxAge: req.session.cookie.maxAge,
                        httpOnly: true,
                        secure: false // Set to true if using https
                    });

                    logActivity(user.id, username, 'login'); // Log login activity

                    res.json({ success: true });
                } else {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    });
});

app.post('/logout', (req, res) => {
    const username = req.session.username;
    req.session.destroy();
    res.clearCookie("session_cookie_name");
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = "DELETE FROM sessions WHERE session_id = ?";
        connection.query(query, [req.cookies.session_id], (error) => {
            connection.release();
            if (error) throw error;
            logActivity(null, username, 'logout'); // Log logout activity
            res.sendStatus(200);
        });
    });
});

function sessionCheck(req) {
    const sessionId = req.cookies.session_cookie_name;
    if (!sessionId) return null;
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err);
            const query = "SELECT data FROM sessions WHERE session_id = ?";
            connection.query(query, [sessionId], (error, results) => {
                connection.release();
                if (error) reject(error);
                if (results.length) resolve(results[0].data);
                else resolve(null);
            });
        });
    });
}

app.post('/cart/add', (req, res) => {
    const { item_id } = req.body;

    // Check if the user is logged in
    if (!req.session.user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    pool.getConnection((err, connection) => {
        if (err) throw err;
        const checkQuery = "SELECT quantity FROM cart WHERE user_id = ? AND item_id = ?";
        connection.query(checkQuery, [req.session.user_id, item_id], (error, results) => {
            if (error) {
                connection.release();
                throw error;
            }

            if (results.length > 0) {
                // Item already in cart, update quantity
                const updateQuery = "UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND item_id = ?";
                connection.query(updateQuery, [req.session.user_id, item_id], (error, results) => {
                    connection.release();
                    if (error) throw error;
                    logActivity(req.session.user_id, req.session.username, 'add-to-cart'); // Log add-to-cart activity
                    res.json({ message: 'Item quantity updated successfully' });
                });
            } else {
                // Item not in cart, insert new row
                const insertQuery = "INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, 1)";
                connection.query(insertQuery, [req.session.user_id, item_id], (error, results) => {
                    connection.release();
                    if (error) throw error;
                    logActivity(req.session.user_id, req.session.username, 'add-to-cart'); // Log add-to-cart activity
                    res.json({ message: 'Item added to cart successfully' });
                });
            }
        });
    });
});

app.get('/cart', (req, res) => {
    const user_id = req.session.user_id;

    // Check if the user is logged in
    if (!user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = `
            SELECT items.id, items.name, items.description, items.price, items.image_url, cart.quantity
            FROM cart
                     JOIN items ON cart.item_id = items.id
            WHERE cart.user_id = ?
        `;
        connection.query(query, [user_id], (error, results) => {
            connection.release();
            if (error) throw error;
            res.json(results);
        });
    });
});

app.delete('/cart/:item_id', (req, res) => {
    const { item_id } = req.params;
    const { quantity } = req.body; // Get the quantity to remove from the request body
    const user_id = req.session.user_id;

    // Check if the user is logged in
    if (!user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    pool.getConnection((err, connection) => {
        if (err) throw err;

        // First, check the current quantity of the item in the cart
        const checkQuery = "SELECT quantity FROM cart WHERE user_id = ? AND item_id = ?";
        connection.query(checkQuery, [user_id, item_id], (error, results) => {
            if (error) {
                connection.release();
                throw error;
            }

            if (results.length && results[0].quantity > quantity) {
                // If the current quantity is greater than the quantity to remove, update the quantity
                const updateQuery = "UPDATE cart SET quantity = quantity - ? WHERE user_id = ? AND item_id = ?";
                connection.query(updateQuery, [quantity, user_id, item_id], (error, results) => {
                    connection.release();
                    if (error) throw error;
                    res.json({ message: 'Item quantity updated successfully' });
                });
            } else {
                // If the current quantity is less than or equal to the quantity to remove, delete the item from the cart
                const deleteQuery = "DELETE FROM cart WHERE user_id = ? AND item_id = ?";
                connection.query(deleteQuery, [user_id, item_id], (error, results) => {
                    connection.release();
                    if (error) throw error;
                    res.json({ message: 'Item removed from cart successfully' });
                });
            }
        });
    });
});

app.delete('/items/:id', (req, res) => {
    const { id } = req.params;

    // Check if the user is admin
    if (!req.session.user_id || req.session.username !== 'admin') {
        return res.status(403).json({ message: 'Only admin can delete items' });
    }

    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = "DELETE FROM items WHERE id = ?";
        connection.query(query, [id], (error, results) => {
            connection.release();
            if (error) {
                res.status(500).json({ error: 'Error deleting item' });
                throw error;
            }
            res.json({ message: 'Item deleted successfully' });
        });
    });
});


app.post('/checkout', (req, res) => {
    const user_id = req.session.user_id;

    // Check if the user is logged in
    if (!user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    pool.getConnection((err, connection) => {
        if (err) throw err;

        // Start a transaction
        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                throw err;
            }

            // Get cart items for the user
            const query = `
                SELECT items.id, items.name, items.price, items.stock, cart.quantity
                FROM cart
                JOIN items ON cart.item_id = items.id
                WHERE cart.user_id = ?
            `;
            connection.query(query, [user_id], (error, cartItems) => {
                if (error) {
                    return connection.rollback(() => {
                        connection.release();
                        throw error;
                    });
                }

                // Calculate total amount
                const totalAmount = cartItems.reduce((total, item) => {
                    return total + item.price * item.quantity;
                }, 0);

                // Insert new order
                const orderQuery = "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)";
                connection.query(orderQuery, [user_id, totalAmount], (error, orderResult) => {
                    if (error) {
                        return connection.rollback(() => {
                            connection.release();
                            throw error;
                        });
                    }

                    const orderId = orderResult.insertId;

                    // Insert order items
                    const orderItemsQuery = "INSERT INTO order_items (order_id, item_id, quantity) VALUES ?";
                    const orderItemsValues = cartItems.map(item => [orderId, item.id, item.quantity]);

                    connection.query(orderItemsQuery, [orderItemsValues], (error, result) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                throw error;
                            });
                        }

                        // Update the stock for each item
                        const updateStockPromises = cartItems.map(item => {
                            return new Promise((resolve, reject) => {
                                const newStock = item.stock - item.quantity;
                                if (newStock < 0) {
                                    return reject(new Error(`Not enough stock for item: ${item.name}`));
                                }
                                const updateQuery = "UPDATE items SET stock = ? WHERE id = ?";
                                connection.query(updateQuery, [newStock, item.id], (err, result) => {
                                    if (err) return reject(err);
                                    resolve(result);
                                });
                            });
                        });

                        Promise.all(updateStockPromises)
                            .then(() => {
                                // Clear the cart
                                const deleteQuery = "DELETE FROM cart WHERE user_id = ?";
                                connection.query(deleteQuery, [user_id], (error, results) => {
                                    if (error) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            throw error;
                                        });
                                    }

                                    // Commit the transaction
                                    connection.commit(err => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                throw err;
                                            });
                                        }
                                        connection.release();
                                        res.json({ message: 'Checkout successful' });
                                    });
                                });
                            })
                            .catch(error => {
                                connection.rollback(() => {
                                    connection.release();
                                    res.status(400).json({ message: error.message });
                                });
                            });
                    });
                });
            });
        });
    });
});

app.get('/admin/activities', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = "SELECT * FROM activities ORDER BY datetime DESC";
        connection.query(query, (error, results) => {
            connection.release();
            if (error) throw error;
            res.json(results);
        });
    });
});



const logActivity = (user_id, username, type) => {
    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = "INSERT INTO activities (user_id, username, type, datetime) VALUES (?, ?, ?, ?)";
        connection.query(query, [user_id, username, type, datetime], (error, results) => {
            connection.release();
            if (error) throw error;
        });
    });
};

app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, image_url } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = "UPDATE items SET name = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE id = ?";
        connection.query(query, [name, description, price, stock, image_url, id], (error, results) => {
            connection.release();
            if (error) {
                res.status(500).json({ error: 'Error updating item' });
                throw error;
            }
            res.json({ message: 'Item updated successfully' });
        });
    });
});

app.post('/change-username', (req, res) => {
    const { newUsername } = req.body;

    // Check if the user is logged in
    if (!req.session.user_id) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    pool.getConnection((err, connection) => {
        if (err) throw err;

        // Check if the new username already exists
        const checkQuery = "SELECT * FROM users WHERE username = ?";
        connection.query(checkQuery, [newUsername], (error, results) => {
            if (error) {
                connection.release();
                return res.status(500).json({ message: 'Error checking username' });
            }

            if (results.length > 0) {
                connection.release();
                return res.status(400).json({ message: 'Username already exists' });
            }

            // Update the username
            const updateQuery = "UPDATE users SET username = ? WHERE id = ?";
            connection.query(updateQuery, [newUsername, req.session.user_id], (error, results) => {
                connection.release();
                if (error) {
                    return res.status(500).json({ message: 'Error updating username' });
                }

                // Update the session username
                req.session.username = newUsername;
                res.json({ message: 'Username updated successfully' });
            });
        });
    });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
