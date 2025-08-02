import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Get database connection info
    const dbInfo = await pool.query(`
      SELECT 
        current_database() as database_name,
        current_user as user_name,
        inet_server_addr() as server_address,
        version() as postgres_version
    `);
    
    // Get table counts
    const tableCounts = await pool.query(`
      SELECT 
        'students' as table_name, COUNT(*) as row_count FROM students
      UNION ALL
      SELECT 
        'login_sessions' as table_name, COUNT(*) as row_count FROM login_sessions
      UNION ALL
      SELECT 
        'admins' as table_name, COUNT(*) as row_count FROM admins
    `);
    
    return NextResponse.json({
      success: true,
      databaseInfo: dbInfo.rows[0],
      tableCounts: tableCounts.rows
    });
  } catch (error) {
    console.error("Database info error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
