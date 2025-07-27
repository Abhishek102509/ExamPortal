"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { examAPI, userAPI, queryAPI } from "../../services/api"
import { Users, FileText, CheckCircle, HelpCircle, Calendar, Award, Plus, TrendingUp, Clock } from "lucide-react"
import toast from "react-hot-toast"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalResults: 0,
    pendingQueries: 0,
  })
  const [recentExams, setRecentExams] = useState([])
  const [recentQueries, setRecentQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const [examsRes, queriesRes, usersRes] = await Promise.all([
        examAPI.getAllExams().catch((error) => {
          console.error("Error fetching exams:", error)
          return { data: [] }
        }),
        queryAPI.getAllQueries().catch((error) => {
          console.error("Error fetching queries:", error)
          return { data: [] }
        }),
        userAPI.getAllUsers().catch((error) => {
          console.error("Error fetching users:", error)
          return { data: [] }
        }),
      ])

      console.log("=== ADMIN DASHBOARD DEBUG ===")
      console.log("Exams:", examsRes.data)
      console.log("Queries:", queriesRes.data)
      console.log("Users:", usersRes.data)

      const totalExams = examsRes.data?.length || 0
      const activeExams = examsRes.data?.filter(exam => {
        const now = new Date()
        const startTime = new Date(exam.startTime)
        const endTime = new Date(exam.endTime)
        return now >= startTime && now <= endTime
      }).length || 0
      const pendingQueries = queriesRes.data?.filter(q => q.status === "PENDING")?.length || 0
      const totalStudents = usersRes.data?.filter(u => u.role === "STUDENT")?.length || 0

      setStats({
        totalExams,
        activeExams,
        pendingQueries,
        totalStudents,
      })

      setRecentExams(examsRes.data?.slice(0, 5) || [])
      setRecentQueries(queriesRes.data?.slice(0, 5) || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      link: "/admin/users",
    },
    {
      title: "Total Exams",
      value: stats.totalExams,
      icon: FileText,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      link: "/admin/exams",
    },
    {
      title: "Completed Exams",
      value: stats.totalResults,
      icon: CheckCircle,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      link: "/admin/results",
    },
    {
      title: "Pending Queries",
      value: stats.pendingQueries,
      icon: HelpCircle,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      link: "/admin/queries",
    },
  ]

  const quickActions = [
    {
      title: "Create New Exam",
      description: "Set up a new examination",
      icon: Plus,
      color: "bg-blue-50 hover:bg-blue-100",
      iconColor: "text-blue-600",
      action: () => navigate("/admin/exams"),
    },
    {
      title: "Manage Students",
      description: "View and manage students",
      icon: Users,
      color: "bg-green-50 hover:bg-green-100",
      iconColor: "text-green-600",
      action: () => navigate("/admin/users"),
    },
    {
      title: "View Results",
      description: "Check exam results",
      icon: Award,
      color: "bg-purple-50 hover:bg-purple-100",
      iconColor: "text-purple-600",
      action: () => navigate("/admin/results"),
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-blue-100">Manage your exams, students, and track performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={index} 
              className={`${stat.bgColor} rounded-xl p-4 sm:p-6 border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md`}
              onClick={() => navigate(stat.link)}
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Exams */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Exams</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentExams.length > 0 ? (
              recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{exam.title}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {exam.duration} minutes
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0 ${
                      exam.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {exam.active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No exams created yet</p>
                <button 
                  onClick={() => navigate("/admin/exams")}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Create your first exam
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Queries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Queries</h2>
            <HelpCircle className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentQueries.length > 0 ? (
              recentQueries.map((query) => (
                <div key={query.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{query.subject}</p>
                    <p className="text-sm text-gray-500">From: {query.studentName}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0 ${
                      query.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {query.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No queries yet</p>
                <p className="text-sm text-gray-400 mt-1">Student queries will appear here</p>
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
    </div>
  )
}

export default AdminDashboard
