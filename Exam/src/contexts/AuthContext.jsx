"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)

      console.log("Login response:", response.data)

      // Backend now returns: { jwt: "token", message: "success", user: {...} }
      const { jwt: token, user: userData, message } = response.data

      if (!token) {
        throw new Error("No token received from server")
      }

      if (!userData) {
        throw new Error("No user data received from server")
      }

      // The backend now sends complete user data in the response
      // including role, so we don't need to fetch profile separately
      
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      console.error("Login error:", error)
      
      // Handle validation errors
      let errorMessage = "Login failed"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors) {
        // Handle validation errors array
        errorMessage = error.response.data.errors.join(", ")
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
