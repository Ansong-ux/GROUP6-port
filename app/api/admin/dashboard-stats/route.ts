import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    // Get various statistics from the database
    const [activeSessionsResult, totalStudentsResult, todayLoginsResult] = await Promise.all([
      // Active sessions count
      pool.query("SELECT COUNT(*) as count FROM login_sessions WHERE session_status = 'active'"),

      // Total registered students
      pool.query("SELECT COUNT(*) as count FROM students"),

      // Today's logins
      pool.query(`
        SELECT COUNT(*) as count 
        FROM login_sessions 
        WHERE DATE(login_time) = CURRENT_DATE
      `),
    ])

    const stats = {
      activeSessionCount: Number.parseInt(activeSessionsResult.rows[0].count),
      totalStudentCount: Number.parseInt(totalStudentsResult.rows[0].count),
      todayLoginCount: Number.parseInt(todayLoginsResult.rows[0].count),
      systemStatus: "online",
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      stats: stats,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard stats",
      },
      { status: 500 },
    )
  }
}
