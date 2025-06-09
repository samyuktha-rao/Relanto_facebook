// Run this file with: node create_admin.js
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createAdmin() {
  const password = 'admin'; // Change this to your desired admin password
  const hash = await bcrypt.hash(password, 10);
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', // Change if your MySQL password is different
    database: 'internal_facebook',
  });
  const [result] = await db.execute(
    'INSERT INTO employees (full_name, username, password, designation) VALUES (?, ?, ?, ?)',
    ['Admin User', 'admin@company.com', hash, 'admin']
  );
  console.log('Admin employee created with id:', result.insertId);
  await db.end();
}

createAdmin().catch(console.error);
