const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  connectionString: 'postgresql://maximus:new_secure_password@localhost:5432/ug_student_portal',
  ssl: false,
});

async function testAdminUser() {
  try {
    // Test database connection
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    
    // Check if admin user exists
    const adminResult = await pool.query(
      'SELECT * FROM admins WHERE name = $1 AND admin_id = $2',
      ['Maximus', '12345']
    );
    
    if (adminResult.rows.length > 0) {
      console.log('Admin user found:', adminResult.rows[0]);
    } else {
      console.log('Admin user not found in the database');
    }
    
    // List all admins
    const allAdmins = await pool.query('SELECT * FROM admins');
    console.log('All admins in database:', allAdmins.rows);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

testAdminUser();
