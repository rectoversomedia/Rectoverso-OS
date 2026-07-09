const { Client } = require('pg');

// Try to connect using different connection strings
// We need to find the database password

async function tryConnect() {
  // Supabase provides connection via the pooler at db.{ref}.supabase.co
  // But we need the password

  // Let's try connecting with no password first to see the error
  const client = new Client({
    host: 'db.bgfhhlhoqtxgpmbetrvx.supabase.co',
    port: 6543, // Try direct port first
    database: 'postgres',
    user: 'postgres',
    password: process.env.PGPASSWORD || ''
  });

  try {
    await client.connect();
    console.log('Connected!');
    const res = await client.query('SELECT NOW()');
    console.log('Server time:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.log('Connection error:', err.message);
    console.log('\nTo connect to Supabase, you need to:');
    console.log('1. Go to: https://supabase.com/dashboard/project/bgfhhlhoqtxgpmbetrvx/settings/database');
    console.log('2. Copy the connection string');
    console.log('3. Set PGPASSWORD=<your-password> and run this script again');
    console.log('\nAlternatively, run the SQL in supabase/schema-setup.sql via the Supabase SQL Editor.');
  }
}

tryConnect();
