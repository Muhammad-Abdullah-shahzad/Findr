const sql = require('mssql');

const config = {
  // --- CHANGES START HERE ---
  user: process.env.SQL_USER,         // Get username from environment variable
  password: process.env.SQL_PASSWORD, // Get password from environment variable
  server: process.env.SQL_SERVER_NAME, // Get server hostname from environment variable
  database: process.env.SQL_DATABASE_NAME, // Get database name from environment variable
  options: {
      encrypt: true, // Recommended for Azure SQL Database
      // Set to false for Azure SQL Database, true for local dev with self-signed certs
      // Always prefer false in production unless you explicitly need to trust a self-signed cert.
      trustServerCertificate: false,
  },
  // --- CHANGES END HERE ---
};

async function connectDB( ) {
    try {
      if (!sql.connected) {
        await sql.connect(config);
        console.log('Connected to SQL Server');
      }
    } catch (err) {
      console.error('Database connection error:', err);
      throw err;
    }
  }
  
  module.exports = {
    sql,
    connectDB
  };

//🛠 How to Use in Other Files

