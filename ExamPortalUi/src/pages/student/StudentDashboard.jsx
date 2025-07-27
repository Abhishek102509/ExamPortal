"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { examAPI, resultAPI, queryAPI } from "../../services/api"
import { toast } from "react-hot-toast"
import { useNavigate, useLocation } from "react-router-dom"
import {
  FileText,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Calendar,
  Award,
  Play,
  BookOpen,
} from "lucide-react"

const StudentDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [stats, setStats] = useState({
    availableExams: 0,
    completedExams: 0,
    averageScore: 0,
    pendingQueries: 0,
  })
  const [recentExams, setRecentExams] = useState([])
  const [recentResults, setRecentResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [location.pathname]) // Refresh when location changes (e.g., returning from exam)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      console.log("=== STARTING DASHBOARD DATA FETCH ===")
      
      const [examsRes, resultsRes, queriesRes] = await Promise.all([
        examAPI.getActiveExams().catch((error) => {
          console.error("Error fetching active exams:", error)
          return { data: [] }
        }),
        resultAPI.getMyResults().catch((error) => {
          console.error("Error fetching results:", error)
          return { data: [] }
        }),
        queryAPI.getQueriesByStudent(user?.id).catch((error) => {
          console.error("Error fetching queries:", error)
          return { data: [] }
        }),
      ])

      console.log("=== STUDENT DASHBOARD DEBUG ===")
      console.log("Active exams API Response:", examsRes)
      console.log("Results API Response:", resultsRes)
      console.log("Queries API Response:", queriesRes)
      console.log("Active exams from API:", examsRes.data)
      console.log("Current time:", new Date().toISOString())
      console.log("User ID:", user?.id)

      // Check if exams data is valid
      if (!examsRes.data || !Array.isArray(examsRes.data)) {
        console.error("Invalid exams data:", examsRes.data)
        toast.error("Invalid exam data received")
        return
      }

      // Backend already filters for active exams, so we just need to filter out completed ones
      const activeExams = examsRes.data || []
      console.log("Active exams from backend:", activeExams)

      const completedExamIds = resultsRes.data?.map((result) => result.examId) || []
      console.log("Completed exam IDs:", completedExamIds)
      
      const availableExams = activeExams.filter((exam) => !completedExamIds.includes(exam.id))
      console.log("Available exams (not completed):", availableExams)

      const averageScore =
        resultsRes.data?.length > 0
          ? resultsRes.data.reduce((sum, result) => sum + (result.score || 0), 0) / resultsRes.data.length
          : 0

      setStats({
        availableExams: availableExams.length,
        completedExams: resultsRes.data?.length || 0,
        averageScore: Math.round(averageScore),
        pendingQueries: queriesRes.data?.filter((q) => q.status === "PENDING")?.length || 0,
      })

      setRecentExams(availableExams.slice(0, 5))
      setRecentResults(resultsRes.data?.slice(0, 5) || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Available Exams",
      value: stats.availableExams,
      icon: FileText,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      action: () => navigate("/student/exam"),
    },
    {
      title: "Completed Exams",
      value: stats.completedExams,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      action: () => navigate("/student/results"),
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: Award,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      action: () => navigate("/student/results"),
    },
    {
      title: "Pending Queries",
      value: stats.pendingQueries,
      icon: Clock,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      action: () => navigate("/student/queries"),
    },
  ]

  const quickActions = [
    {
      title: "Take Exam",
      description: "Start a new examination",
      icon: Play,
      color: "bg-blue-50 hover:bg-blue-100",
      iconColor: "text-blue-600",
      action: () => navigate("/student/exam"),
    },
    {
      title: "View Results",
      description: "Check your exam results",
      icon: Award,
      color: "bg-green-50 hover:bg-green-100",
      iconColor: "text-green-600",
      action: () => navigate("/student/results"),
    },
    {
      title: "My Queries",
      description: "View your questions",
      icon: BookOpen,
      color: "bg-purple-50 hover:bg-purple-100",
      iconColor: "text-purple-600",
      action: () => navigate("/student/queries"),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome back, {user?.username}!</h1>
        <p className="text-green-100 text-sm sm:text-base">Ready to take your next exam? Check out what's available below.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={index} 
              className={`${stat.bgColor} rounded-xl p-4 sm:p-6 border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md`}
              onClick={stat.action}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl sm:text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Available Exams & Recent Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Exams */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Available Exams</h2>
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentExams.length > 0 ? (
              recentExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  onClick={() => navigate("/student/exam")}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{exam.title}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {exam.durationMin || exam.duration} minutes • {exam.totalMarks} marks
                    </div>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Active
                      </span>
                      <span className="ml-2">
                        Ends: {new Date(exam.endTime).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors ml-2 flex-shrink-0">
                    Start
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No exams available</p>
                <p className="text-sm text-gray-400 mt-1">Check back later for new exams</p>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Debug Info:</strong> Check browser console for exam data
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Results</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentResults.length > 0 ? (
              recentResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{result.examTitle}</p>
                    <p className="text-sm text-gray-500">
                      Completed on {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p
                      className={`text-lg font-bold ${
                        result.score >= 70 ? "text-green-600" : result.score >= 50 ? "text-yellow-600" : "text-red-600"
                      }`}
                    >
                      {result.score}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {result.obtainedMarks}/{result.totalMarks}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No results yet</p>
                <p className="text-sm text-gray-400 mt-1">Take an exam to see your results here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                onClick={action.action}
                className={`flex items-center p-4 ${action.color} rounded-lg transition-colors`}
              >
                <Icon className={`h-8 w-8 ${action.iconColor} mr-3`} />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Debug Section - Temporary */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-yellow-900 mb-4">Debug Information</h2>
        <div className="space-y-2 text-sm text-yellow-800">
          <p><strong>Available Exams Count:</strong> {stats.availableExams}</p>
          <p><strong>Completed Exams Count:</strong> {stats.completedExams}</p>
          <p><strong>Current Time:</strong> {new Date().toISOString()}</p>
          <p><strong>User ID:</strong> {user?.id}</p>
          <p className="text-xs">
            <strong>Instructions:</strong> Open browser console (F12) to see detailed exam data and filtering information.
          </p>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.completedExams}</p>
            <p className="text-sm text-gray-500">Exams Completed</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
            <p className="text-sm text-gray-500">Average Score</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.completedExams > 0 ? "Good" : "Start"}</p>
            <p className="text-sm text-gray-500">Progress</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
