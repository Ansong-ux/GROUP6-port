const pool = require("./lib/db");

async function testConnection() {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM students");
    console.log("Database connection successful. Students count:", result.rows[0].count);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

testConnection();
