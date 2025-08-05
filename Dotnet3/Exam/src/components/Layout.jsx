import { useAuth } from "../contexts/AuthContext"
import { useNavigate, useLocation } from "react-router-dom"
import { Container, Row, Col, Card, Button, Offcanvas, Nav, Navbar } from 'react-bootstrap'
import { BookOpen, LogOut, User, Home, FileText, Users, HelpCircle, Menu, X, Settings, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const isTeacher = user?.role === "TEACHER"

  const navigation = isTeacher
    ? [
        { name: "Dashboard", href: "/admin/dashboard", icon: Home },
        { name: "Exam Management", href: "/admin/exams", icon: FileText },
        { name: "Question Management", href: "/admin/questions", icon: FileText },
        { name: "User Management", href: "/admin/users", icon: Users },
        { name: "Student Queries", href: "/admin/queries", icon: HelpCircle },
         { name: "ExamResults", href: "/admin/results", icon: HelpCircle },
      ]
    : [
        { name: "Dashboard", href: "/student/dashboard", icon: Home },
        { name: "Take Exam", href: "/student/exam", icon: FileText },
        { name: "Results", href: "/student/results", icon: BarChart3 },
        { name: "My Queries", href: "/student/queries", icon: HelpCircle },
      ]

  const isActive = (href) => location.pathname === href

  return (
    <Container fluid className="min-vh-100 d-flex p-0">
      {/* Sidebar Offcanvas for mobile */}
      <Offcanvas show={sidebarOpen} onHide={() => setSidebarOpen(false)} placement="start">
        <Offcanvas.Header className="gradient-primary text-white">
          <div className="d-flex align-items-center">
            <BookOpen className="me-2" size={32} />
            <Offcanvas.Title className="fw-bold">ExamPortal</Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <div className="d-flex flex-column h-100">
            {/* Navigation */}
            <Nav className="flex-column p-3 flex-grow-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.name}
                    variant="link"
                    onClick={() => {
                      navigate(item.href)
                      setSidebarOpen(false)
                    }}
                    className={`text-start text-decoration-none d-flex align-items-center p-3 mb-2 rounded ${
                      isActive(item.href)
                        ? "sidebar-active"
                        : "text-dark"
                    }`}
                  >
                    <Icon className="me-3" size={20} />
                    {item.name}
                  </Button>
                )
              })}
            </Nav>

            {/* User section */}
            <div className="border-top p-3">
              <div className="d-flex align-items-center mb-3">
                <div className="gradient-primary rounded-circle p-2">
                  <User className="text-white" size={20} />
                </div>
                <div className="ms-3">
                  <p className="mb-0 fw-medium small">{user?.username}</p>
                  <p className="mb-0 text-muted small text-capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleLogout}
                className="w-100 d-flex align-items-center justify-content-center"
              >
                <LogOut className="me-2" size={16} />
                Logout
              </Button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Desktop Sidebar */}
      <div className="d-none d-lg-flex flex-column bg-white shadow" style={{ width: '280px', height: '100vh', position: 'sticky', top: 0 }}>
        {/* Header */}
        <div className="gradient-primary text-white p-4">
          <div className="d-flex align-items-center">
            <BookOpen className="me-2" size={32} />
            <span className="fs-4 fw-bold">ExamPortal</span>
          </div>
        </div>

        {/* Navigation */}
        <Nav className="flex-column p-3 flex-grow-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.name}
                variant="link"
                onClick={() => navigate(item.href)}
                className={`text-start text-decoration-none d-flex align-items-center p-3 mb-2 rounded ${
                  isActive(item.href)
                    ? "sidebar-active"
                    : "text-dark"
                }`}
              >
                <Icon className="me-3" size={20} />
                {item.name}
              </Button>
            )
          })}
        </Nav>

        {/* User section */}
        <div className="border-top p-3">
          <div className="d-flex align-items-center mb-3">
            <div className="gradient-primary rounded-circle p-2">
              <User className="text-white" size={20} />
            </div>
            <div className="ms-3">
              <p className="mb-0 fw-medium small">{user?.username}</p>
              <p className="mb-0 text-muted small text-capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleLogout}
            className="w-100 d-flex align-items-center justify-content-center"
          >
            <LogOut className="me-2" size={16} />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top bar */}
        {/* <Navbar bg="white" className="shadow-sm border-bottom sticky-top px-4">
          <div className="d-flex align-items-center">
            <Button 
              variant="link"
              onClick={() => setSidebarOpen(true)} 
              className="d-lg-none text-muted p-2"
            >
              <Menu size={24} />
            </Button>
            <h1 className="h5 mb-0 ms-2 ms-lg-0 fw-semibold">
              {navigation.find((item) => isActive(item.href))?.name || "Dashboard"}
            </h1>
          </div>
          <div className="d-flex align-items-center">
            <div className="d-none d-sm-flex align-items-center me-3">
              <span className="text-muted small me-2">Welcome,</span>
              <span className="fw-medium small">{user?.username}</span>
            </div>
            <div className="d-sm-none">
              <div className="gradient-primary rounded-circle p-1">
                <User className="text-white" size={16} />
              </div>
            </div>
          </div>
        </Navbar> */}




<Navbar bg="white" className="shadow-sm border-bottom sticky-top">
  <Container fluid>
    <div className="d-flex justify-content-between w-100 align-items-center">
      {/* Left side - Menu button and title */}
      <div className="d-flex align-items-center">
        <Button 
          variant="link"
          onClick={() => setSidebarOpen(true)} 
          className="d-lg-none text-dark p-2 me-2"
        >
          <Menu size={24} />
        </Button>
        <h1 className="h5 mb-0 fw-semibold">
          {navigation.find((item) => isActive(item.href))?.name || "Dashboard"}
        </h1>
      </div>

      {/* Right side - User info */}
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center me-3">
          <span className="text-muted small me-2">Welcome,</span>
          <span className="fw-medium">{user?.username}</span>
        </div>
        <div className="d-lg-none">
          <div className="bg-primary rounded-circle p-1">
            <User className="text-white" size={16} />
          </div>
        </div>
      </div>
    </div>
  </Container>
</Navbar>


        {/* Page content */}
        <main className="flex-grow-1 p-4 overflow-auto">
          <Container fluid className="h-100">
            {children}
          </Container>
        </main>
      </div>
    </Container>
  )
}

export default Layout
