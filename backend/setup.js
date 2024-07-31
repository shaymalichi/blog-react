const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // Change this to your root password
    multipleStatements: true
});

const setupFilePath = path.join(__dirname, 'setup.sql');

fs.readFile(setupFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading setup.sql file:', err);
        return;
    }

    connection.query(data, (error, results) => {
        if (error) {
            console.error('Error executing setup.sql:', error);
            return;
        }

        console.log('Database setup completed successfully.');
        connection.end();
    });
});
