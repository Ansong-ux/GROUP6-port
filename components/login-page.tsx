"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"

interface LoginPageProps {
  onLogin: (userData: any) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [loginData, setLoginData] = useState({
    userType: "student",
    name: "",
    studentId: "",
    email: "",
  })
  const [isProspective, setIsProspective] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Get current date
  const getCurrentDate = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return now.toLocaleDateString("en-US", options)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Check if it's admin login
      if (loginData.userType === "admin") {
        if (loginData.name.toLowerCase() === "maximus" && loginData.studentId === "12345") {
          const adminData = {
            name: "Maximus",
            studentId: "12345",
            email: "admin@ug.edu.gh",
            userType: "admin",
            isAdmin: true,
          }
          localStorage.setItem("isAuthenticated", "true")
          localStorage.setItem("userData", JSON.stringify(adminData))
          onLogin(adminData)
          return
        } else {
          setError("Invalid admin credentials")
          setLoading(false)
          return
        }
      }

      // Student login - call backend API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: loginData.name,
          studentId: loginData.studentId,
          email: loginData.email,
          userType: loginData.userType,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userData", JSON.stringify(data.userData))
        onLogin(data.userData)
      } else {
        setError(data.message || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      {/* Header */}
      <div className="login-header">
        <h1>UNIVERSITY OF GHANA</h1>
        <div className="login-date">{getCurrentDate()}</div>
      </div>

      <div className="login-content">
        {/* University Logo Section */}
        <div className="university-logo">
          <div className="logo-crest">
            <Image
              src="/university-of-ghana-logo.png"
              alt="University of Ghana Coat of Arms"
              width={140}
              height={140}
              className="ug-logo"
              priority
            />
          </div>
          <h2>UNIVERSITY OF GHANA</h2>
        </div>

        <div className="login-sections">
          {/* Prospective Students Section */}
          <div className="login-section">
            <div className="section-header">Prospective Students</div>
            <div className="section-content">
              <p>
                If you are a prospective student, not registered at this institution, please select the following
                option:
              </p>
              <div className="prospective-option" onClick={() => setIsProspective(true)}>
                <span className="option-icon">🎓</span>
                <span>
                  Apply, Register, Change personal information, get academic and other information and make payments.
                </span>
              </div>
            </div>
          </div>

          {/* Registered Users Section */}
          <div className="login-section">
            <div className="section-header">Registered Users: Login Credentials</div>
            <form onSubmit={handleLogin} className="login-form">
              <div className="user-type-selection">
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="student"
                    checked={loginData.userType === "student"}
                    onChange={(e) => setLoginData({ ...loginData, userType: e.target.value })}
                  />
                  Student
                </label>
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="admin"
                    checked={loginData.userType === "admin"}
                    onChange={(e) => setLoginData({ ...loginData, userType: e.target.value })}
                  />
                  Admin
                </label>
              </div>

              <div className="form-group">
                <label>{loginData.userType === "admin" ? "Admin Name:" : "Full Name:"}</label>
                <input
                  type="text"
                  value={loginData.name}
                  onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
                  placeholder={loginData.userType === "admin" ? "Enter admin name" : "Enter your full name"}
                  required
                />
              </div>

              <div className="form-group">
                <label>{loginData.userType === "admin" ? "Admin ID:" : "Student ID:"}</label>
                <input
                  type="text"
                  value={loginData.studentId}
                  onChange={(e) => setLoginData({ ...loginData, studentId: e.target.value })}
                  placeholder={loginData.userType === "admin" ? "Enter admin ID" : "Enter your student ID"}
                  required
                />
              </div>

              {loginData.userType === "student" && (
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              )}

              {error && <div className="error-message">{error}</div>}

              <div className="login-buttons">
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
                <div className="secondary-buttons">
                  <button type="button" className="secondary-btn">
                    Forgot Credentials
                  </button>
                  <button type="button" className="secondary-btn">
                    Request Help
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="login-footer">
        <span>
          [Contact Us | About Us | Disclaimer | Terms & Conditions | Privacy & Security Statement | Powered By]
        </span>
      </div>

      {/* Prospective Student Modal */}
      {isProspective && (
        <div className="modal-overlay" onClick={() => setIsProspective(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Prospective Student Portal</h3>
            <p>Welcome to the University of Ghana Prospective Student Portal.</p>
            <div className="prospective-options">
              <button className="prospective-btn">Apply for Admission</button>
              <button className="prospective-btn">Check Application Status</button>
              <button className="prospective-btn">View Programs</button>
              <button className="prospective-btn">Contact Admissions</button>
            </div>
            <button className="close-btn" onClick={() => setIsProspective(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
