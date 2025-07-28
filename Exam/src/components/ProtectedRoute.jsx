

"use client"

import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"
import { Container, Spinner } from 'react-bootstrap'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-4 text-muted">Loading...</p>
        </div>
      </Container>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on user role
    if (user.role === "TEACHER") {
      return <Navigate to="/admin/dashboard" replace />
    } else {
      return <Navigate to="/student/dashboard" replace />
    }
  }

  return children
}

export default ProtectedRoute

