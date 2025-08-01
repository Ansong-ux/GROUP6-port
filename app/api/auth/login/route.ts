import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, studentId, email, userType } = await request.json()

    // Validate required fields for students
    if (userType === "student") {
      if (!name || !studentId || !email) {
        return NextResponse.json(
          {
            success: false,
            message: "Name, Student ID, and Email are required for student login",
          },
          { status: 400 },
        )
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          {
            success: false,
            message: "Please enter a valid email address",
          },
          { status: 400 },
        )
      }

      // Get client IP address
      const forwarded = request.headers.get("x-forwarded-for")
      const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"
      const userAgent = request.headers.get("user-agent") || "unknown"

      try {
        // Insert or update student record
        await pool.query(
          `
          INSERT INTO students (name, student_id, email, updated_at)
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
          ON CONFLICT (student_id) 
          DO UPDATE SET 
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            updated_at = CURRENT_TIMESTAMP
        `,
          [name.trim(), studentId.trim(), email.trim().toLowerCase()],
        )

        // Record login session
        const sessionResult = await pool.query(
          `
          INSERT INTO login_sessions (student_id, name, email, ip_address, user_agent)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, login_time
        `,
          [studentId.trim(), name.trim(), email.trim().toLowerCase(), ip, userAgent],
        )

        const studentData = {
          name: name.trim(),
          studentId: studentId.trim(),
          email: email.trim().toLowerCase(),
          userType: "student",
          loginTime: sessionResult.rows[0].login_time,
          sessionId: sessionResult.rows[0].id,
          isAdmin: false,
        }

        console.log("Student logged in and recorded in database:", studentData)

        return NextResponse.json({
          success: true,
          userData: studentData,
          message: "Login successful",
        })
      } catch (dbError: any) {
        console.error("Database error:", dbError)

        // Handle unique constraint violations
        if (dbError.code === "23505") {
          if (dbError.constraint?.includes("email")) {
            return NextResponse.json(
              {
                success: false,
                message: "This email is already registered with a different student ID",
              },
              { status: 400 },
            )
          }
        }

        return NextResponse.json(
          {
            success: false,
            message: "Database error occurred during login",
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid user type",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error occurred during login",
      },
      { status: 500 },
    )
  }
}
