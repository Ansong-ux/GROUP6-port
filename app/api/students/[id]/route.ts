import { type NextRequest, NextResponse } from "next/server"

// Mock database (in a real app, this would be a proper database)
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const studentData = await request.json()
    const studentIndex = students.findIndex((s) => s.studentId === params.id)

    if (studentIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 },
      )
    }

    students[studentIndex] = { ...students[studentIndex], ...studentData }

    return NextResponse.json({
      success: true,
      student: students[studentIndex],
      message: "Student updated successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update student",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const studentIndex = students.findIndex((s) => s.studentId === params.id)

    if (studentIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 },
      )
    }

    students.splice(studentIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete student",
      },
      { status: 500 },
    )
  }
}
