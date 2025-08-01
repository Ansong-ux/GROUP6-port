import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Simulate a few test student logins
    const testStudents = [
      {
        name: "John Doe",
        studentId: "UG001",
        email: "john.doe@st.ug.edu.gh",
        userType: "student",
        loginTime: new Date().toISOString(),
        isAdmin: false,
      },
      {
        name: "Jane Smith",
        studentId: "UG002",
        email: "jane.smith@st.ug.edu.gh",
        userType: "student",
        loginTime: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        isAdmin: false,
      },
      {
        name: "Michael Johnson",
        studentId: "UG003",
        email: "michael.johnson@st.ug.edu.gh",
        userType: "student",
        loginTime: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        isAdmin: false,
      },
    ]

    // Record each test student
    for (const student of testStudents) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/admin/logged-students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Test students added successfully",
      studentsAdded: testStudents.length,
    })
  } catch (error) {
    console.error("Error adding test students:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add test students",
      },
      { status: 500 },
    )
  }
}
