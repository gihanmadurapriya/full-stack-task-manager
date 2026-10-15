// Database connection pool using mysql2/promise
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool to handle multiple concurrent queries efficiently
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_manager',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Automatically cast MySQL TINYINT(1) to JavaScript boolean (true / false)
  typeCast: function (field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      const val = field.string();
      return val === null ? null : val === '1';
    }
    return next();
  }
});

// Helper function to test the database connection during server startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Successfully connected to MySQL database:', process.env.DB_NAME || 'task_manager');
    connection.release();
  } catch (error) {
    console.error('✗ Failed to connect to MySQL database:');
    console.error('  Error message:', error.message);
    console.error('  Please ensure MySQL server is running and check your .env credentials.');
  }
}

module.exports = {
  pool,
  testConnection
};
