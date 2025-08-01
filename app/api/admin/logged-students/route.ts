import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    // Get all active login sessions with student details
    const result = await pool.query(`
      SELECT 
        ls.id,
        ls.student_id,
        ls.name,
        ls.email,
        ls.login_time,
        ls.session_status,
        ls.ip_address,
        s.created_at as student_registered_at
      FROM login_sessions ls
      LEFT JOIN students s ON ls.student_id = s.student_id
      WHERE ls.session_status = 'active'
      ORDER BY ls.login_time DESC
      LIMIT 100
    `)

    const students = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      studentId: row.student_id,
      email: row.email,
      loginTime: row.login_time,
      status: row.session_status,
      ipAddress: row.ip_address,
      registeredAt: row.student_registered_at,
    }))

    return NextResponse.json({
      success: true,
      students: students,
      total: students.length,
    })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch logged students",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { studentId } = await request.json()

    // Update session status to 'logged_out' instead of deleting
    await pool.query(
      `
      UPDATE login_sessions 
      SET session_status = 'logged_out', logout_time = CURRENT_TIMESTAMP
      WHERE student_id = $1 AND session_status = 'active'
    `,
      [studentId],
    )

    return NextResponse.json({
      success: true,
      message: "Student session ended successfully",
    })
  } catch (error) {
    console.error("Error ending student session:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to end student session",
      },
      { status: 500 },
    )
  }
}
