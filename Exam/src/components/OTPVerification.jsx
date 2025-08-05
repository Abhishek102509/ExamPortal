"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate, useLocation } from "react-router-dom"
import { otpAPI } from "../services/api"
import toast from "react-hot-toast"
import { BookOpen, Mail, Shield, RefreshCw } from "lucide-react"

function OTPVerification() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes countdown
  const [canResend, setCanResend] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get email from location state or redirect to signup
  const email = location.state?.email
  
  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please register again.")
      navigate("/signup")
      return
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, navigate])

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 6) {
      setOtp(value)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP")
      return
    }

    setLoading(true)

    try {
      const response = await otpAPI.verifyOTP({
        email: email,
        otp: otp
      })

      if (response.status === 200) {
        toast.success("Email verified successfully! You can now sign in.")
        navigate("/login", { state: { email: email } })
      } else {
        toast.error(response.data || "OTP verification failed")
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      toast.error(error.response?.data?.message || "OTP verification failed")
    }

    setLoading(false)
  }

  const handleResendOTP = async () => {
    setResendLoading(true)

    try {
      const response = await otpAPI.resendOTP({ email: email })

      if (response.status === 200) {
        toast.success("OTP has been resent to your email")
        setTimeLeft(600) // Reset timer to 10 minutes
        setCanResend(false)
      } else {
        toast.error(response.data || "Failed to resend OTP")
      }
    } catch (error) {
      console.error("Resend OTP error:", error)
      toast.error(error.response?.data?.message || "Failed to resend OTP")
    }

    setResendLoading(false)
  }

  if (!email) {
    return null // Component will redirect in useEffect
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
                    <Shield className="text-white" size={32} />
                  </div>
                </div>
                <h2 className="h3 fw-bold text-dark mb-2">Verify Your Email</h2>
                <p className="text-muted small mb-3">
                  We've sent a 6-digit verification code to:
                </p>
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <Mail size={16} className="text-primary me-2" />
                  <span className="fw-medium text-primary">{email}</span>
                </div>
                <p className="text-muted small">
                  Enter the code below to complete your registration
                </p>
              </div>

              {/* OTP Timer */}
              {timeLeft > 0 && (
                <Alert variant="info" className="text-center mb-4">
                  <small>
                    Code expires in: <strong>{formatTime(timeLeft)}</strong>
                  </small>
                </Alert>
              )}

              {timeLeft === 0 && (
                <Alert variant="warning" className="text-center mb-4">
                  <small>Your OTP has expired. Please request a new one.</small>
                </Alert>
              )}

              {/* OTP Form */}
              <Form onSubmit={handleVerifyOTP}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium text-center d-block">
                    Enter 6-Digit Code
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={handleOTPChange}
                    placeholder="123456"
                    className="text-center fs-4 py-3 letter-spacing-wide"
                    style={{ 
                      letterSpacing: '0.5em',
                      fontFamily: 'monospace'
                    }}
                    maxLength={6}
                    required
                  />
                  <div className="text-center mt-2">
                    <small className="text-muted">
                      {otp.length}/6 digits entered
                    </small>
                  </div>
                </Form.Group>

                {/* Verify Button */}
                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-100 btn-gradient py-3 fw-medium mb-3"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>

                {/* Resend Button */}
                <div className="text-center">
                  <p className="text-muted small mb-2">Didn't receive the code?</p>
                  <Button
                    variant="outline-primary"
                    onClick={handleResendOTP}
                    disabled={!canResend || resendLoading}
                    className="fw-medium"
                  >
                    {resendLoading ? (
                      <>
                        <RefreshCw className="me-2" size={16} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="me-2" size={16} />
                        Resend Code
                      </>
                    )}
                  </Button>
                </div>
              </Form>

              {/* Back to Login */}
              <div className="text-center mt-4">
                <Button
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="text-muted text-decoration-none small"
                >
                  Back to Sign In
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default OTPVerification
