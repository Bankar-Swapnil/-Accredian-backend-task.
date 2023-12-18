const mysql = require('mysql');

// Database connection configuration
const db = mysql.createConnection({
    host: 'localhost',      // Database host
    user: 'root',           // Database user
    password: 'root@123',    // Database password
    database: 'Accredian_backend_task'  // Database name
});

module.exports = db;
