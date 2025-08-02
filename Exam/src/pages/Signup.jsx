"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"
import { BookOpen, User, Mail, Lock, UserCheck, Eye, EyeOff } from "lucide-react"

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "STUDENT",
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const { signup } = useAuth()
  const navigate = useNavigate()

  function validateForm() {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleChange(e) {
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

  async function handleSubmit(e) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await signup(formData)

      if (result.success) {
        toast.success("Registration successful! Please check your email for OTP.")
        // Navigate to OTP verification page with email
        navigate("/verify-otp", { state: { email: formData.email } })
      } else {
        // Handle different types of errors from backend
        let errorMessage = result.error || result.message
        if (errorMessage && typeof errorMessage === 'string') {
          if (errorMessage.includes('Username already exists')) {
            setErrors({ username: 'Username already exists' })
          } else if (errorMessage.includes('Email already exists')) {
            setErrors({ email: 'Email already exists' })
          }
        }
        toast.error(errorMessage || 'Signup failed')
      }
    } catch (error) {
      console.error("Signup error:", error)
      toast.error("An unexpected error occurred")
    }

    setLoading(false)
  }

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center position-relative">
      {/* Background overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100 gradient-primary opacity-75"></div>
      
      <Row className="justify-content-center w-100 position-relative" style={{ zIndex: 10 }}>
        <Col xs={11} sm={8} md={6} lg={5} xl={4}>
          <Card className="shadow-lg backdrop-blur">
            <Card.Body className="p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="d-flex justify-content-center mb-3">
                  <div className="gradient-secondary rounded-circle p-3 shadow">
                    <BookOpen className="text-white" size={32} />
                  </div>
                </div>
                <h2 className="h3 fw-bold text-dark mb-2">Create your account</h2>
                <p className="text-muted small">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary text-decoration-none fw-medium">
                    Sign in here
                  </Link>
                </p>
              </div>

              {/* Form */}
              <Form onSubmit={handleSubmit}>
                {/* Username field */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <User size={20} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      required
                      isInvalid={!!errors.username}
                      className="border-start-0"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Email field */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <Mail size={20} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      isInvalid={!!errors.email}
                      className="border-start-0"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* First Name field */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">First Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <User size={20} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      required
                      isInvalid={!!errors.firstName}
                      className="border-start-0"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Last Name field */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Last Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <User size={20} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      required
                      isInvalid={!!errors.lastName}
                      className="border-start-0"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Password field */}
                <Form.Group className="mb-3">
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
                      placeholder="Create a password"
                      required
                      isInvalid={!!errors.password}
                      className="border-start-0 border-end-0"
                    />
                    <InputGroup.Text 
                      className="bg-light border-start-0 cursor-pointer"
                      onClick={function() { setShowPassword(!showPassword) }}
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="text-muted" />
                      ) : (
                        <Eye size={20} className="text-muted" />
                      )}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Role field */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Role</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <UserCheck size={20} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="border-start-0"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TEACHER">Teacher</option>
                    </Form.Select>
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
                      Creating account...
                    </>
                  ) : (
                    "Create account"
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

export default Signup
