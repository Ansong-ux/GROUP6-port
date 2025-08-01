"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Activity,
  LogOut,
  Menu,
  X,
  Clock,
  Search,
  Download,
  Eye,
  Trash2,
  RefreshCw,
} from "lucide-react"

interface AdminDashboardProps {
  userData: any
  onLogout: () => void
}

interface LoggedInStudent {
  id: number
  name: string
  studentId: string
  email: string
  loginTime: string
  status: string
}

export default function AdminDashboard({ userData, onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loggedInStudents, setLoggedInStudents] = useState<LoggedInStudent[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Fetch logged in students
  useEffect(() => {
    fetchLoggedInStudents()
    // Refresh every 30 seconds
    const interval = setInterval(fetchLoggedInStudents, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchLoggedInStudents = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/logged-students")
      if (response.ok) {
        const data = await response.json()
        setLoggedInStudents(data.students || [])
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

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
    { id: "students", label: "Logged Students", icon: Users },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "reports", label: "Reports", icon: Download },
  ]

  // Filter students based on search term
  const filteredStudents = loggedInStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const renderDashboardContent = () => (
    <div className="dashboard-content">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>Welcome back, {userData?.name}!</h2>
        <p>Administrative Dashboard - Monitor student activities and system usage.</p>
      </div>

      {/* Test Section - Remove in production */}
      <div
        className="test-section"
        style={{
          marginBottom: "30px",
          padding: "20px",
          background: "#fff3cd",
          borderRadius: "8px",
          border: "1px solid #ffeaa7",
        }}
      >
        <h3 style={{ color: "#856404", marginBottom: "15px" }}>🧪 Test Section (Remove in Production)</h3>
        <button
          onClick={async () => {
            try {
              const response = await fetch("/api/test-student-login", { method: "POST" })
              const data = await response.json()
              if (data.success) {
                alert('Test students added! Refresh the "Logged Students" section to see them.')
                fetchLoggedInStudents() // Refresh the data
              }
            } catch (error) {
              alert("Error adding test students")
            }
          }}
          style={{
            padding: "10px 20px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Add Test Students
        </button>
        <button
          onClick={fetchLoggedInStudents}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Refresh Student List
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Students Logged</h3>
            <Users className="stat-icon" />
          </div>
          <div className="stat-number">{loggedInStudents.length}</div>
          <div className="stat-label">Currently active</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Today's Logins</h3>
            <UserCheck className="stat-icon" />
          </div>
          <div className="stat-number">
            {loggedInStudents.filter((s) => new Date(s.loginTime).toDateString() === new Date().toDateString()).length}
          </div>
          <div className="stat-label">New logins today</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>System Status</h3>
            <Activity className="stat-icon" />
          </div>
          <div className="stat-number">Online</div>
          <div className="stat-trend positive">All systems operational</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Last Updated</h3>
            <Clock className="stat-icon" />
          </div>
          <div className="stat-number">{getCurrentTime()}</div>
          <div className="stat-label">Real-time monitoring</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-grid">
        <div className="dashboard-card recent-activity-card">
          <div className="card-header">
            <h3>Recent Student Activity</h3>
            <button className="card-action" onClick={fetchLoggedInStudents}>
              <RefreshCw className="action-icon" />
              Refresh
            </button>
          </div>
          <div className="activity-list">
            {loggedInStudents.slice(0, 5).map((student) => (
              <div key={student.id} className="activity-item">
                <div className="activity-avatar">{student.name.charAt(0)}</div>
                <div className="activity-details">
                  <div className="activity-title">{student.name} logged in</div>
                  <div className="activity-time">
                    {new Date(student.loginTime).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="activity-status">
                  <span className="status-badge active">Active</span>
                </div>
              </div>
            ))}
            {loggedInStudents.length === 0 && <div className="no-activity">No student activity recorded yet.</div>}
          </div>
        </div>

        <div className="dashboard-card system-info-card">
          <div className="card-header">
            <h3>System Information</h3>
          </div>
          <div className="system-info">
            <div className="info-item">
              <span className="info-label">Server Status</span>
              <span className="info-value status-online">Online</span>
            </div>
            <div className="info-item">
              <span className="info-label">Database</span>
              <span className="info-value status-online">Connected</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Backup</span>
              <span className="info-value">2 hours ago</span>
            </div>
            <div className="info-item">
              <span className="info-label">System Load</span>
              <span className="info-value">Normal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStudentsContent = () => (
    <div className="students-content">
      <div className="students-header">
        <h2>Logged In Students</h2>
        <div className="students-actions">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="refresh-btn" onClick={fetchLoggedInStudents} disabled={loading}>
            <RefreshCw className={`refresh-icon ${loading ? "spinning" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="students-table-container">
        {loading && <div className="loading-overlay">Loading students...</div>}

        <table className="students-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Student ID</th>
              <th>Email</th>
              <th>Login Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="table-avatar">{student.name.charAt(0)}</div>
                </td>
                <td className="student-name">{student.name}</td>
                <td className="student-id">{student.studentId}</td>
                <td className="student-email">{student.email}</td>
                <td className="login-time">
                  {new Date(student.loginTime).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>
                  <span className="status-badge active">Active</span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="action-btn view-btn" title="View Details">
                      <Eye className="action-icon" />
                    </button>
                    <button className="action-btn delete-btn" title="Remove">
                      <Trash2 className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && !loading && (
          <div className="no-students">
            {searchTerm ? "No students found matching your search." : "No students have logged in yet."}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="dashboard-app admin-dashboard">
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
            <h1>University of Ghana - Admin Portal</h1>
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
        <aside className={`sidebar admin-sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-header">
            <div className="user-info">
              <div className="user-avatar admin-avatar">{userData?.name?.charAt(0) || "A"}</div>
              <div className="user-details">
                <div className="user-name">{userData?.name || "Admin"}</div>
                <div className="user-role">Administrator</div>
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
          {activeSection === "students" && renderStudentsContent()}
          {activeSection !== "dashboard" && activeSection !== "students" && (
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
