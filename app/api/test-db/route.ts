import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    // Test database connection
    const result = await pool.query("SELECT NOW() as current_time, version() as pg_version")

    // Test tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      currentTime: result.rows[0].current_time,
      postgresVersion: result.rows[0].pg_version,
      tables: tablesResult.rows.map((row) => row.table_name),
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
