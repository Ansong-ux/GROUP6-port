import { type NextRequest, NextResponse } from "next/server"

// Mock database
const students = [
  {
    studentId: "1",
    name: "John Doe",
    email: "john@st.ug.edu.gh",
    studentNumber: "10123456",
    cellphone: "+233123456789",
    studyAddress: "Legon Campus",
    currentBalance: "1250.00",
  },
]

export async function GET() {
  return NextResponse.json(students)
}

export async function POST(request: NextRequest) {
  try {
    const studentData = await request.json()
    const newStudent = {
      ...studentData,
      studentId: Date.now().toString(),
    }

    students.push(newStudent)

    return NextResponse.json({
      success: true,
      student: newStudent,
      message: "Student created successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create student",
      },
      { status: 500 },
    )
  }
}
