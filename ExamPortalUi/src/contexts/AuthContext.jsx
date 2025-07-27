// "use client"

// import { createContext, useContext, useState, useEffect } from "react"
// import { authAPI } from "../services/api"

// const AuthContext = createContext()

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     const userData = localStorage.getItem("user")

//     if (token && userData) {
//       try {
//         setUser(JSON.parse(userData))
//       } catch (error) {
//         console.error("Error parsing user data:", error)
//         localStorage.removeItem("token")
//         localStorage.removeItem("user")
//       }
//     }
//     setLoading(false)
//   }, [])

//   const login = async (credentials) => {
//     try {
//       const response = await authAPI.login(credentials)

//       console.log("Login response:", response.data) // Debug log

//       // Handle different possible response structures from Spring Boot
//       let token, userData

//       if (response.data.token) {
//         token = response.data.token
//         userData = response.data.user || response.data
//       } else if (response.data.jwt) {
//         token = response.data.jwt
//         userData = response.data.user || response.data
//       } else if (response.data.accessToken) {
//         token = response.data.accessToken
//         userData = response.data.user || response.data
//       } else if (response.data.authToken) {
//         token = response.data.authToken
//         userData = response.data.user || response.data
//       } else {
//         // If the entire response is the token
//         token = response.data
//         userData = { username: credentials.username }
//       }

//       if (!token) {
//         throw new Error("No token received from server")
//       }

//       // Ensure userData has required fields
//       if (!userData.role && !userData.userRole) {
//         // If no role in response, try to get user profile
//         try {
//           const profileResponse = await fetch(`http://localhost:8080/api/users/profile`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           })
//           if (profileResponse.ok) {
//             const profileData = await profileResponse.json()
//             userData = { ...userData, ...profileData }
//           }
//         } catch (profileError) {
//           console.warn("Could not fetch user profile:", profileError)
//         }
//       }

//       // Normalize role field
//       if (userData.userRole && !userData.role) {
//         userData.role = userData.userRole
//       }

//       localStorage.setItem("token", token)
//       localStorage.setItem("user", JSON.stringify(userData))
//       setUser(userData)

//       return { success: true, user: userData }
//     } catch (error) {
//       console.error("Login error:", error)
//       return {
//         success: false,
//         error: error.response?.data?.message || error.message || "Login failed",
//       }
//     }
//   }

//   const signup = async (userData) => {
//     try {
//       const response = await authAPI.signup(userData)
//       return { success: true, data: response.data }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.response?.data?.message || "Signup failed",
//       }
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem("token")
//     localStorage.removeItem("user")
//     setUser(null)
//   }

//   const value = {
//     user,
//     login,
//     signup,
//     logout,
//     loading,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }



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

      // Handle different possible response structures from Spring Boot
      let token, userData

      if (response.data.token) {
        token = response.data.token
        userData = response.data.user || response.data
      } else if (response.data.jwt) {
        token = response.data.jwt
        userData = response.data.user || response.data
      } else if (response.data.accessToken) {
        token = response.data.accessToken
        userData = response.data.user || response.data
      } else if (response.data.authToken) {
        token = response.data.authToken
        userData = response.data.user || response.data
      } else {
        // If the entire response is the token
        token = response.data
        userData = { username: credentials.username }
      }

      if (!token) {
        throw new Error("No token received from server")
      }

      // Ensure userData has required fields
      if (!userData.role && !userData.userRole) {
        // If no role in response, try to get user profile
        try {
          const profileResponse = await fetch(`http://localhost:8080/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            userData = { ...userData, ...profileData }
          }
        } catch (profileError) {
          console.warn("Could not fetch user profile:", profileError)
        }
      }

      // Normalize role field
      if (userData.userRole && !userData.role) {
        userData.role = userData.userRole
      }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Login failed",
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
