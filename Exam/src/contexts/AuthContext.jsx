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
      
      console.log("Signup response:", response.data)
      
      // If we get a successful HTTP response (200/201), consider it successful
      // The backend saves the user successfully and returns a response
      if (response.status >= 200 && response.status < 300) {
        return { 
          success: true, 
          message: response.data?.message || "Registration successful",
          data: response.data 
        }
      }
      
      // Fallback check for explicit success field
      return { 
        success: response.data?.success || false, 
        message: response.data?.message || "Signup failed",
        data: response.data 
      }
    } catch (error) {
      console.error("Signup error:", error)
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      }
    }
  }

  const verifyOTP = async (otpData) => {
    try {
      const response = await authAPI.verifyOTP(otpData)
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "OTP verification failed",
      }
    }
  }

  const resendOTP = async (emailData) => {
    try {
      const response = await authAPI.resendOTP(emailData)
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to resend OTP",
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
    verifyOTP,
    resendOTP,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
