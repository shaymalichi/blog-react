const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'online_store_db',
    connectionLimit: 5
});

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

app.use(express.static('build'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
});

app.route('/posts')
    .get((req, res) => {
        getAllPosts(res);
    })
    .post((req, res) => {
        addPost(req, res);
    });

// function getAllPosts(res) {
//     pool.getConnection((err, connection) => {
//         if (err) throw err;
//         const query = "SELECT user_id, id, title, body, created_at FROM posts1";
//         connection.query(query, (error, results) => {
//             connection.release();
//             if (error) throw error;
//             res.json(results.map(r => ({
//                 ...r,
//                 created_at: r.created_at.toISOString().replace('T', ' ').substr(0, 19)
//             })));
//         });
//     });
// }

// app.get('/posts/:post_id/comments', (req, res) => {
//     const post_id = req.params.post_id;
//     pool.getConnection((err, connection) => {
//         if (err) throw err;
//         const query = "SELECT user_id, body, post_id FROM comments WHERE post_id = ?";
//         connection.query(query, [post_id], (error, results) => {
//             connection.release();
//             if (error) throw error;
//             res.json(results);
//         });
//     });
// });

// app.route('/posts/:post_id')
//     .get((req, res) => {
//         getPost(req.params.post_id, res);
//     })
//     .post((req, res) => {
//         editPost(req, res);
//     })
//     .delete((req, res) => {
//         deletePost(req.params.post_id, req, res);
//     });

// function getPost(post_id, res) {
//     pool.getConnection((err, connection) => {
//         if (err) throw err;
//         const query = "SELECT user_id, id, title, body, created_at FROM posts1 WHERE id = ?";
//         connection.query(query, [post_id], (error, result) => {
//             connection.release();
//             if (error) throw error;
//             if (result.length) {
//                 res.json({
//                     ...result[0],
//                     created_at: result[0].created_at.toISOString().replace('T', ' ').substr(0, 19)
//                 });
//             } else {
//                 res.status(404).json({ error: 'Post not found' });
//             }
//         });
//     });
// }

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



// function addPost(req, res) {
//     const { title, body, created_at } = req.body;
//     const user = sessionCheck(req);
//     pool.getConnection((err, connection) => {
//         if (err) throw err;
//         const query = "INSERT INTO posts1 (user_id, title, body, created_at) VALUES (?, ?, ?, ?)";
//         connection.query(query, [user, title, body, created_at], (error, results) => {
//             connection.release();
//             if (error) throw error;
//             res.json({ message: 'Post added successfully', new_city_id: results.insertId });
//         });
//     });
// }

// function deletePost(post_id, req, res) {
//     const user = sessionCheck(req);
//     pool.getConnection((err, connection) => {
//         if (err) throw err;
//         const query = "DELETE FROM posts1 WHERE id = ? AND user_id = ?";
//         connection.query(query, [post_id, user], (error, results) => {
//             if (error) {
//                 connection.release();
//                 res.status(404).json({ error: "Error deleting post: " + error.message });
//             } else {
//                 connection.commit();
//                 connection.release();
//                 res.send("Post deleted successfully");
//             }
//         });
//     });
// }

// function editPost(req, res) {
//     const { postid, content } = req.body;
//     const user = sessionCheck(req);
//     pool.getConnection((err, connection) => {
//         if (err) throw err;
//         const query = "UPDATE posts1 SET body = ? WHERE id = ? AND user_id = ?";
//         connection.query(query, [content, postid, user], (error, results) => {
//             connection.release();
//             if (error) {
//                 res.status(401).json({ error: "Error editing post: " + error.message });
//             } else {
//                 res.send("Post edited successfully");
//             }
//         });
//     });
// }

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = "SELECT username, password FROM users WHERE username = ?";
        connection.query(query, [username], (error, results) => {
            connection.release();
            if (results.length) {
                const hashedPassword = results[0].password;
                if (bcrypt.compareSync(password, hashedPassword)) {
                    const sessionId = uuid.v4();
                    pool.getConnection((err, connection) => {
                        if (err) throw err;
                        const sessionQuery = "INSERT INTO sessions (username, session_id) VALUES (?, ?)";
                        connection.query(sessionQuery, [username, sessionId], (err) => {
                            connection.release();
                            if (err) throw err;
                            res.cookie("session_id", sessionId).json({ success: true });
                        });
                    });
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
    const username = sessionCheck(req);
    req.session.destroy();
    res.clearCookie("session_id");
    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = "DELETE FROM sessions WHERE username = ?";
        connection.query(query, [username], (error) => {
            connection.release();
            if (error) throw error;
            res.sendStatus(200);
        });
    });
});

function sessionCheck(req) {
    const sessionId = req.cookies.session_id;
    if (!sessionId) return null;
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err);
            const query = "SELECT username FROM sessions WHERE session_id = ?";
            connection.query(query, [sessionId], (error, results) => {
                connection.release();
                if (error) reject(error);
                if (results.length) resolve(results[0].username);
                else resolve(null);
            });
        });
    });
}

// app.post('/comments', (req, res) => {
//     const { postid, content } = req.body;
//     sessionCheck(req).then(username => {
//         if (!username) {
//             res.status(401).json({ error: "Unauthorized" });
//         } else {
//             pool.getConnection((err, connection) => {
//                 if (err) throw err;
//                 const query = "INSERT INTO comments (user_id, body, post_id) VALUES (?, ?, ?)";
//                 connection.query(query, [username, content, postid], (error) => {
//                     connection.release();
//                     if (error) throw error;
//                     res.sendStatus(201);
//                 });
//             });
//         }
//     }).catch(err => {
//         res.status(500).json({ error: "Internal Server Error" });
//     });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
