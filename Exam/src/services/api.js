// import axios from "axios"

// const API_BASE_URL = "http://localhost:8080/api"

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// // Add token to requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

// // Handle token expiration
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token")
//       localStorage.removeItem("user")
//       window.location.href = "/login"
//     }
//     return Promise.reject(error)
//   },
// )

// // Auth API
// export const authAPI = {
//   login: (credentials) => api.post("/auth/signin", credentials),
//   signup: (userData) => api.post("/auth/signup", userData),
// }

// // User API
// export const userAPI = {
//   getProfile: () => api.get("/users/profile"),
//   updateProfile: (data) => api.put("/users/profile", data),
//   getAllUsers: () => api.get("/users"),
//   getUserById: (id) => api.get(`/users/${id}`),
//   updateUser: (id, data) => api.put(`/users/${id}`, data),
//   deleteUser: (id) => api.delete(`/users/${id}`),
// }

// // Exam API
// export const examAPI = {
//   getAllExams: () => api.get("/exams"),
//   getExamById: (id) => api.get(`/exams/${id}`),
//   createExam: (data) => api.post("/exams", data),
//   updateExam: (id, data) => api.put(`/exams/${id}`, data),
//   deleteExam: (id) => api.delete(`/exams/${id}`),
//   getAvailableExams: () => api.get("/exams/available"),
//   submitExam: (examId, submissionData) => api.post(`/exams/${examId}/submit`, submissionData),
// }

// // Question API
// export const questionAPI = {
//   getQuestionsByExam: (examId) => api.get(`/questions/exam/${examId}`),
//   createQuestion: (data) => api.post("/questions", data),
//   updateQuestion: (id, data) => api.put(`/questions/${id}`, data),
//   deleteQuestion: (id) => api.delete(`/questions/${id}`),
// }

// // Result API
// export const resultAPI = {
//   getUserResults: (userId) => api.get(`/results/user/${userId}`),
//   getResultById: (id) => api.get(`/results/${id}`),
//   getAllResults: () => api.get("/results"),
// }

// // Student Query API
// export const queryAPI = {
//   getUserQueries: (userId) => api.get(`/queries/user/${userId}`),
//   createQuery: (data) => api.post("/queries", data),
//   getAllQueries: () => api.get("/queries"),
//   updateQuery: (id, data) => api.put(`/queries/${id}`, data),
// }

// export default api






import axios from "axios"

const API_BASE_URL = "http://localhost:8080/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/signin", credentials),
  signup: (userData) => api.post("/auth/signup", userData),
}

// User API
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  getAllUsers: () => api.get("/users"),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
}

// Exam API
export const examAPI = {
  getAllExams: () => api.get("/exams"),
  getExamById: (id) => api.get(`/exams/${id}`),
  createExam: (examData) => api.post("/exams", examData),
  updateExam: (id, examData) => api.put(`/exams/${id}`, examData),
  deleteExam: (id) => api.delete(`/exams/${id}`),
  getActiveExams: () => api.get("/exams/active"),
  getUpcomingExams: () => api.get("/exams/upcoming"),
  submitExam: (submissionData) => api.post("/exams/submit", submissionData),
}

// Question API
export const questionAPI = {
  getQuestionsByExam: (examId) => api.get(`/questions/exam/${examId}`),
  createQuestion: (questionData) => api.post("/questions", questionData),
  updateQuestion: (id, questionData) => api.put(`/questions/${id}`, questionData),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),
}

// Result API
export const resultAPI = {
  getMyResults: () => api.get("/exams/results/my"),
  getResultsByExam: (examId) => api.get(`/exams/${examId}/results`),
  getResultById: (id) => api.get(`/results/${id}`),
}

// Student Query API
export const queryAPI = {
  getAllQueries: () => api.get("/queries"),
  getQueriesByStudent: (studentId) => api.get(`/queries/student/${studentId}`),
  createQuery: (queryData) => api.post("/queries", queryData),
  updateQuery: (id, queryData) => api.put(`/queries/${id}`, queryData),
  deleteQuery: (id) => api.delete(`/queries/${id}`),
}

export default api
