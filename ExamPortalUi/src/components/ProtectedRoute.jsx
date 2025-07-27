// "use client"

// import { useAuth } from "../contexts/AuthContext"
// import { Navigate } from "react-router-dom"

// const ProtectedRoute = ({ children, requiredRole }) => {
//   const { user, loading } = useAuth()

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />
//   }

//   if (requiredRole && user.role !== requiredRole) {
//     // Redirect to appropriate dashboard based on user role
//     if (user.role === "ADMIN") {
//       return <Navigate to="/admin/dashboard" replace />
//     } else {
//       return <Navigate to="/student/dashboard" replace />
//     }
//   }

//   return children
// }

// export default ProtectedRoute




"use client"

import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
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
