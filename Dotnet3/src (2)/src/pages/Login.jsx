"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"
import { BookOpen, User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (user.role === "TEACHER") {
        navigate("/admin/dashboard")
      } else {
        navigate("/student/dashboard")
      }
    }
  }, [user, navigate])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Email or Username is required"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await login(formData)

      if (result.success) {
        toast.success("Login successful!")
        if (result.user.role === "TEACHER") {
          navigate("/admin/dashboard")
        } else {
          navigate("/student/dashboard")
        }
      } else {
        toast.error(result.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center position-relative">
      {/* Background overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100 gradient-primary opacity-75"></div>
      
      <Row className="justify-content-center w-100 position-relative" style={{ zIndex: 10 }}>
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card className="shadow-lg backdrop-blur">
            <Card.Body className="p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="d-flex justify-content-center mb-3">
                  <div className="gradient-primary rounded-circle p-3 shadow">
                    <BookOpen className="text-white" size={32} />
                  </div>
                </div>
                <h2 className="h3 fw-bold text-dark mb-2">Welcome back</h2>
                <p className="text-muted small">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary text-decoration-none fw-medium">
                    Sign up here
                  </Link>
                </p>
              </div>

              {/* Form */}
              <Form onSubmit={handleSubmit}>
                {/* Email or Username field */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Email or Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <User size={20} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="emailOrUsername"
                      value={formData.emailOrUsername}
                      onChange={handleChange}
                      placeholder="Enter your email or username"
                      required
                      isInvalid={!!errors.emailOrUsername}
                      className="border-start-0"
                    />
                    <Form.Control.Feedback type="invalid">
                      <AlertCircle size={16} className="me-1" />
                      {errors.emailOrUsername}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Password field */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <Lock size={20} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      isInvalid={!!errors.password}
                      className="border-start-0 border-end-0"
                    />
                    <InputGroup.Text 
                      className="bg-light border-start-0 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="text-muted" />
                      ) : (
                        <Eye size={20} className="text-muted" />
                      )}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      <AlertCircle size={16} className="me-1" />
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-100 btn-gradient py-3 fw-medium"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
