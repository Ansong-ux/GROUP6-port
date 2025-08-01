"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/login-page"
import StudentDashboard from "@/components/student-dashboard"
import AdminDashboard from "@/components/admin-dashboard"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    const user = localStorage.getItem("userData")
    if (auth === "true" && user) {
      setIsAuthenticated(true)
      setUserData(JSON.parse(user))
    }
  }, [])

  const handleLogin = (user: any) => {
    setIsAuthenticated(true)
    setUserData(user)
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userData")
    setIsAuthenticated(false)
    setUserData(null)
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  // Check if user is admin
  if (userData?.isAdmin || userData?.userType === "admin") {
    return <AdminDashboard userData={userData} onLogout={handleLogout} />
  }

  // Default to student dashboard
  return <StudentDashboard userData={userData} onLogout={handleLogout} />
}
