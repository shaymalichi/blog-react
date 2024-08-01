const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbFile = path.join(__dirname, 'online_store_db.sqlite');
const sqlFile = path.join(__dirname, 'initialize_db.sql');

const db = new sqlite3.Database(dbFile);

const initDb = () => {
    fs.readFile(sqlFile, 'utf8', (err, sql) => {
        if (err) {
            console.error('Error reading SQL file', err);
            process.exit(1);
        }
        db.exec(sql, (err) => {
            if (err) {
                console.error('Error executing SQL script', err);
                process.exit(1);
            }
            console.log('Database tables initialized successfully');
            insertInitialData();
        });
    });
};

const insertInitialData = () => {
    const adminPasswordHash = bcrypt.hashSync('admin', bcrypt.genSaltSync());

    const items = [
        {
            name: 'Laptop',
            description: 'A high-performance laptop with 16GB RAM and 512GB SSD.',
            price: 1200.00,
            stock: 10,
            image_url: 'https://cdn.thewirecutter.com/wp-content/media/2023/11/laptops-2048px-8826.jpg?auto=webp&quality=75&crop=1.91:1&width=1200',
            created_at: '2024-07-29 11:57:04'
        },
        {
            name: 'Smartphone',
            description: 'Latest model smartphone with amazing features.',
            price: 799.99,
            stock: 25,
            image_url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWNE3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1708130629560',
            created_at: '2024-07-29 11:57:04'
        },
        {
            name: 'Headphones',
            description: 'Wireless headphones with noise-cancelling feature.',
            price: 199.50,
            stock: 50,
            image_url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQTQ3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1687660671363',
            created_at: '2024-07-29 11:57:04'
        },
        {
            name: 'Smartwatch',
            description: 'A smartwatch with fitness tracking and heart rate monitor.',
            price: 149.99,
            stock: 30,
            image_url: 'https://m.media-amazon.com/images/I/311yHNaKbCL._AC_UF1000,1000_QL80_.jpg',
            created_at: '2024-07-29 11:57:04'
        },
        {
            name: 'Tablet',
            description: 'A tablet with 10-inch display and 64GB storage.',
            price: 299.99,
            stock: 20,
            image_url: 'https://cdn.mos.cms.futurecdn.net/N5v7A65ccEqTjkBSChxBUW-320-80.jpg',
            created_at: '2024-07-29 11:57:04'
        }
    ];

    db.serialize(() => {
        // Check if admin user exists
        db.get("SELECT COUNT(*) AS count FROM users WHERE username = ?", ['admin'], (err, row) => {
            if (err) {
                console.error('Error checking admin user', err);
                process.exit(1);
            }
            if (row.count === 0) {
                // Insert admin user if not exists
                db.run("INSERT INTO users (username, created_at, password, profile_info) VALUES (?, ?, ?, ?)",
                    ['admin', new Date().toISOString().slice(0, 19).replace('T', ' '), adminPasswordHash, 'Admin user'], (err) => {
                        if (err) {
                            console.error('Error inserting admin user', err);
                            process.exit(1);
                        }
                    });
            } else {
                console.log('Admin user already exists');
            }
        });

        // Insert items
        const insertItem = db.prepare("INSERT INTO items (name, description, price, stock, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?)");
        items.forEach(item => {
            insertItem.run(item.name, item.description, item.price, item.stock, item.image_url, item.created_at, (err) => {
                if (err) {
                    console.error('Error inserting item', err);
                    process.exit(1);
                }
            });
        });

        insertItem.finalize((err) => {
            if (err) {
                console.error('Error finalizing statement', err);
                process.exit(1);
            }
            console.log('Initial data inserted successfully');
            db.close();
        });
    });
};

initDb();
