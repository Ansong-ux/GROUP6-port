"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  DollarSign,
  Calendar,
  LogOut,
  Menu,
  X,
  Star,
  CheckCircle,
  ArrowUpIcon as ArrowUpward,
  Bell,
  Settings,
  FileText,
  CreditCard,
  GraduationCap,
  Clock,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"

interface StudentDashboardProps {
  userData: any
  onLogout: () => void
}

export default function StudentDashboard({ userData, onLogout }: StudentDashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Get current date and time
  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return currentTime.toLocaleDateString("en-US", options)
  }

  const getCurrentTime = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "My Profile", icon: Users },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "results", label: "Results", icon: BarChart3 },
    { id: "finance", label: "Finance", icon: DollarSign },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const renderDashboardContent = () => (
    <div className="dashboard-content">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>Welcome back, {userData?.name || "Student"}!</h2>
        <p>Here's what's happening with your academic journey today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Current Semester</h3>
            <BookOpen className="stat-icon" />
          </div>
          <div className="stat-number">2024/2025</div>
          <div className="stat-label">Academic Year</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Current GPA</h3>
            <BarChart3 className="stat-icon" />
          </div>
          <div className="stat-number">3.8</div>
          <div className="stat-trend positive">
            <ArrowUpward className="trend-icon" />
            +0.2 from last semester
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Credits Earned</h3>
            <Star className="stat-icon" />
          </div>
          <div className="stat-number">84</div>
          <div className="stat-label">Out of 120 required</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Fee Balance</h3>
            <DollarSign className="stat-icon" />
          </div>
          <div className="stat-number">GH₵ 2,450</div>
          <div className="stat-trend positive">
            <CheckCircle className="trend-icon" />
            All paid up
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Profile Summary Card */}
        <div className="dashboard-card profile-card">
          <div className="card-header">
            <h3>Profile Summary</h3>
            <button className="card-action">Edit Profile</button>
          </div>
          <div className="profile-content">
            <div className="photo-avatar">{userData?.name?.charAt(0) || "S"}</div>
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Name</span>
                <span className="value">{userData?.name || "Student Name"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Student ID</span>
                <span className="value">{userData?.studentId || "10123456"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Email</span>
                <span className="value">{userData?.email || "student@st.ug.edu.gh"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Program</span>
                <span className="value">BSC Computer Engineering </span>
              </div>
              <div className="detail-item">
                <span className="label">Level</span>
                <span className="value">200</span>
              </div>
              <div className="detail-item">
                <span className="label">Status</span>
                <span className="status-badge active">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Progress Card */}
        <div className="dashboard-card academic-card">
          <div className="card-header">
            <h3>Academic Progress</h3>
            <button className="card-action">View Details</button>
          </div>
          <div className="progress-list">
            <div className="progress-item">
              <span className="course-name">Data Commmunication </span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "85%" }}></div>
              </div>
              <span className="progress-score">85%</span>
            </div>
            <div className="progress-item">
              <span className="course-name">Data structures and Algorithm </span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "78%" }}></div>
              </div>
              <span className="progress-score">78%</span>
            </div>
            <div className="progress-item">
              <span className="course-name">Academic Writing</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "92%" }}></div>
              </div>
              <span className="progress-score">92%</span>
            </div>
            <div className="progress-item">
              <span className="course-name">Differential Equation</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "71%" }}></div>
              </div>
              <span className="progress-score">71%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card actions-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="action-grid">
            <button className="quick-action">
              <GraduationCap className="action-icon" />
              <span className="action-text">Course Registration</span>
            </button>
            <button className="quick-action">
              <CreditCard className="action-icon" />
              <span className="action-text">Pay Fees</span>
            </button>
            <button className="quick-action">
              <FileText className="action-icon" />
              <span className="action-text">Request Transcript</span>
            </button>
            <button className="quick-action">
              <Calendar className="action-icon" />
              <span className="action-text">View Schedule</span>
            </button>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="dashboard-card notifications-card">
          <div className="card-header">
            <h3>Recent Notifications</h3>
            <button className="card-action">View All</button>
          </div>
          <div className="notifications-list">
            <div className="notification-item">
              <Bell className="notification-icon" />
              <div className="notification-content">
                <div className="notification-title">Assignment Due Soon</div>
                <div className="notification-time">2 hours ago</div>
              </div>
            </div>
            <div className="notification-item">
              <CheckCircle className="notification-icon" />
              <div className="notification-content">
                <div className="notification-title">Fee Payment Confirmed</div>
                <div className="notification-time">1 day ago</div>
              </div>
            </div>
            <div className="notification-item">
              <Calendar className="notification-icon" />
              <div className="notification-content">
                <div className="notification-title">Exam Schedule Updated</div>
                <div className="notification-time">3 days ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="dashboard-card financial-card">
          <div className="card-header">
            <h3>Financial Summary</h3>
            <button className="card-action">View Statement</button>
          </div>
          <div className="financial-content">
            <div className="balance-display">
              <div className="balance-label">Current Balance</div>
              <div className="balance-amount positive">GH₵ 2,450.00</div>
              <div className="balance-status">All fees paid for current semester</div>
            </div>
            <div className="financial-actions">
              <button className="action-btn primary">Make Payment</button>
              <button className="action-btn secondary">View History</button>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="dashboard-card contact-card">
          <div className="card-header">
            <h3>Contact Information</h3>
            <button className="card-action">Edit Profile</button>
          </div>
          <div className="contact-list">
            <div className="contact-item">
              <Mail className="contact-icon" />
              <div className="contact-details">
                <span className="contact-label">Email</span>
                <span className="contact-value">{userData?.email || "student@st.ug.edu.gh"}</span>
              </div>
            </div>
            <div className="contact-item">
              <Phone className="contact-icon" />
              <div className="contact-details">
                <span className="contact-label">Phone</span>
                <span className="contact-value">+233 24 123 4567</span>
              </div>
            </div>
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <div className="contact-details">
                <span className="contact-label">Address</span>
                <span className="contact-value">Legon Campus, Accra</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="dashboard-app">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <Image
            src="/university-of-ghana-logo.png"
            alt="University of Ghana"
            width={50}
            height={50}
            className="header-logo"
          />
          <div className="header-info">
            <h1>University of Ghana - Student Portal</h1>
            <div className="header-date">{getCurrentDate()}</div>
          </div>
        </div>
        <div className="header-right">
          <div className="current-time">
            <Clock className="time-icon" />
            <span>{getCurrentTime()}</span>
          </div>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-header">
            <div className="user-info">
              <div className="user-avatar">{userData?.name?.charAt(0) || "S"}</div>
              <div className="user-details">
                <div className="user-name">{userData?.name || "Student"}</div>
                <div className="user-role">Student</div>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                >
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="sidebar-footer">
            <button onClick={onLogout} className="logout-btn">
              <LogOut className="nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {activeSection === "dashboard" && renderDashboardContent()}
          {activeSection !== "dashboard" && (
            <div className="coming-soon">
              <h2>{sidebarItems.find((item) => item.id === activeSection)?.label}</h2>
              <p>This section is coming soon!</p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}
    </div>
  )
}
