const sql = require('mssql');

const config = {
  user: 'abc',
    password: '1111',
    server: 'NEXERA\\SQLEXPRESS', // Or use your server's IP address or hostname
  database: 'lostandfound',
  options: {
    encrypt: true, // Use encryption for secure connections
    trustServerCertificate: true, // Disable SSL validation (not recommended for production)
  },
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

