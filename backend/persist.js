const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234', // Change this to your root password
    database: 'online_store_db',
    connectionLimit: 5
});

const items = [
    {
        id: 1,
        name: 'Laptop',
        description: 'A high-performance laptop with 16GB RAM and 512GB SSD.',
        price: 1200.00,
        stock: 8,
        image_url: 'https://cdn.thewirecutter.com/wp-content/media/2023/11/laptops-2048px-8826.jpg?auto=webp&quality=75&crop=1.91:1&width=1200',
        created_at: '2024-07-29 11:57:04'
    },
    {
        id: 2,
        name: 'Smartphone',
        description: 'Latest model smartphone with amazing features.',
        price: 799.99,
        stock: 25,
        image_url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWNE3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1708130629560',
        created_at: '2024-07-29 11:57:04'
    },
    {
        id: 3,
        name: 'Headphones',
        description: 'Wireless headphones with noise-cancelling feature.',
        price: 199.50,
        stock: 49,
        image_url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQTQ3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1687660671363',
        created_at: '2024-07-29 11:57:04'
    },
    {
        id: 4,
        name: 'Smartwatch',
        description: 'A smartwatch with fitness tracking and heart rate monitor.',
        price: 149.99,
        stock: 30,
        image_url: 'https://m.media-amazon.com/images/I/311yHNaKbCL._AC_UF1000,1000_QL80_.jpg',
        created_at: '2024-07-29 11:57:04'
    },
    {
        id: 5,
        name: 'Tablet',
        description: 'A tablet with 10-inch display and 64GB storage.',
        price: 299.99,
        stock: 20,
        image_url: 'https://cdn.mos.cms.futurecdn.net/N5v7A65ccEqTjkBSChxBUW-320-80.jpg',
        created_at: '2024-07-29 11:57:04'
    }
];

const insertItems = () => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = `
            INSERT INTO items (id, name, description, price, stock, image_url, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                                     name = VALUES(name),
                                     description = VALUES(description),
                                     price = VALUES(price),
                                     stock = VALUES(stock),
                                     image_url = VALUES(image_url),
                                     created_at = VALUES(created_at)
        `;

        items.forEach(item => {
            connection.query(sql, [item.id, item.name, item.description, item.price, item.stock, item.image_url, item.created_at], (error, results) => {
                if (error) throw error;
                console.log('Item inserted/updated:', item.name);
            });
        });

        connection.release();
    });
};

insertItems();
