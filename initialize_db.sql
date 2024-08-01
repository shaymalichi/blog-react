CREATE TABLE activities (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            user_id INTEGER,
                            username TEXT,
                            type TEXT,
                            datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      user_id INTEGER,
                      item_id INTEGER,
                      quantity INTEGER DEFAULT 1,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       name TEXT NOT NULL,
                       description TEXT,
                       price DECIMAL(10, 2) NOT NULL,
                       stock INTEGER NOT NULL,
                       image_url TEXT,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
                          session_id TEXT PRIMARY KEY,
                          expires INTEGER UNSIGNED NOT NULL,
                          data TEXT
);

CREATE TABLE users (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       username TEXT NOT NULL UNIQUE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       password TEXT NOT NULL,
                       profile_info TEXT
);

CREATE TABLE wishlist (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          user_id INTEGER,
                          item_id INTEGER,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                             order_id INTEGER,
                             item_id INTEGER,
                             quantity INTEGER
);

CREATE TABLE orders (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER,
                        total_amount DECIMAL(10, 2),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                         user_id INTEGER,
                         item_id INTEGER,
                         rating INTEGER,
                         comment TEXT,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial admin user
INSERT INTO users (username, created_at, password, profile_info) VALUES (
                                                                            'admin',
                                                                            CURRENT_TIMESTAMP,
                                                                            '$2a$10$E./1FJd5nW.T2oxKgU8WnO2F.s9vMPNmF4V8lJx5M.f8nbCU.ZY8y', -- bcrypt hash for 'admin'
                                                                            'Admin user'
                                                                        );
