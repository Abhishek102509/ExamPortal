"use client"

import { useState, useEffect } from "react"
import { examAPI } from "../../services/api"
import toast from "react-hot-toast"
import { Plus, Edit, Trash2, Clock, FileText, Search, Calendar, Eye, XCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ExamManagement = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingExam, setEditingExam] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Helper function to format datetime for input fields
  const formatDateTime = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  // Helper function to ensure proper time format
  const ensureProperTimeFormat = (timeString) => {
    if (!timeString) return ""
    
    // If it's already in the correct format, return as is
    if (timeString.includes('T') && timeString.includes(':')) {
      return timeString
    }
    
    // Try to parse and reformat
    const date = new Date(timeString)
    if (isNaN(date.getTime())) {
      return ""
    }
    
    return formatDateTime(date)
  }
  
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    totalMarks: "",
    durationMin: "",
    startTime: "",
    endTime: "",
  })

  const navigate = useNavigate()

  useEffect(() => {
    fetchExams()
    // Initialize with current time
    const now = new Date()
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now
    
    setFormData({
      title: "",
      subject: "",
      totalMarks: "",
      durationMin: "",
      startTime: formatDateTime(now),
      endTime: formatDateTime(endTime),
    })
  }, [])

  const fetchExams = async () => {
    try {
      const response = await examAPI.getAllExams()
      console.log("=== FETCHED EXAMS DEBUG ===")
      console.log("Total exams:", response.data?.length || 0)
      
      if (response.data && response.data.length > 0) {
        response.data.forEach((exam, index) => {
          const now = new Date()
          const startTime = new Date(exam.startTime)
          const endTime = new Date(exam.endTime)
          const isActive = now >= startTime && now <= endTime
          
          console.log(`Exam ${index + 1}: ${exam.title} - ${isActive ? 'ACTIVE' : 'INACTIVE'}`)
          console.log(`  Start: ${startTime.toISOString()}`)
          console.log(`  End: ${endTime.toISOString()}`)
          console.log(`  Current: ${now.toISOString()}`)
        })
      }
      
      setExams(response.data)
    } catch (error) {
      console.error("Error fetching exams:", error)
      toast.error("Failed to fetch exams")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate that end time is after start time
      const startTime = new Date(formData.startTime)
      const endTime = new Date(formData.endTime)
      
      console.log("=== EXAM CREATION DEBUG ===")
      console.log("Start time:", formData.startTime, "->", startTime.toISOString())
      console.log("End time:", formData.endTime, "->", endTime.toISOString())
      console.log("Current time:", new Date().toISOString())
      
      if (endTime <= startTime) {
        toast.error("End time must be after start time")
        setLoading(false)
        return
      }

      const submitData = {
        ...formData,
        totalMarks: parseInt(formData.totalMarks),
        durationMin: parseInt(formData.durationMin),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      }

      console.log("Submitting exam data:", submitData)

      if (editingExam) {
        await examAPI.updateExam(editingExam.id, submitData)
        toast.success("Exam updated successfully")
      } else {
        await examAPI.createExam(submitData)
        toast.success("Exam created successfully")
      }

      fetchExams()
      setShowModal(false)
      resetForm()
    } catch (error) {
      console.error("Exam submission error:", error)
      toast.error(error.response?.data?.message || "Operation failed")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (exam) => {
    // Helper function to format datetime string for input fields
    const formatDateTimeFromString = (dateString) => {
      if (!dateString) return ""
      const date = new Date(dateString)
      return formatDateTime(date)
    }

    setEditingExam(exam)
    setFormData({
      title: exam.title || "",
      subject: exam.subject || "",
      totalMarks: exam.totalMarks?.toString() || "",
      durationMin: exam.durationMin?.toString() || exam.duration?.toString() || "",
      startTime: formatDateTimeFromString(exam.startTime),
      endTime: formatDateTimeFromString(exam.endTime),
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await examAPI.deleteExam(id)
        toast.success("Exam deleted successfully")
        fetchExams()
      } catch (error) {
        toast.error("Failed to delete exam")
      }
    }
  }

  const resetForm = () => {
    // Set default times: start time = now, end time = now + 2 hours
    const now = new Date()
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now
    
    setFormData({
      title: "",
      subject: "",
      totalMarks: "",
      durationMin: "",
      startTime: formatDateTime(now),
      endTime: formatDateTime(endTime),
    })
    setEditingExam(null)
  }

  const filteredExams = exams.filter(
    (exam) =>
      exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading && exams.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600">Create and manage examinations</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const now = new Date()
              const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now
              console.log("=== QUICK TEST EXAM ===")
              console.log("Current time:", now.toISOString())
              console.log("End time:", endTime.toISOString())
              console.log("Formatted start time:", formatDateTime(now))
              console.log("Formatted end time:", formatDateTime(endTime))
              
              setFormData({
                title: "Test Exam - Should Be Active",
                subject: "Test Subject",
                totalMarks: "100",
                durationMin: "60",
                startTime: formatDateTime(now),
                endTime: formatDateTime(endTime),
              })
              setShowModal(true)
            }}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Quick Test
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Exam
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
                <p className="text-gray-600 text-sm mb-2">Subject: {exam.subject}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{exam.description}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  (() => {
                    const now = new Date()
                    const startTime = new Date(exam.startTime)
                    const endTime = new Date(exam.endTime)
                    
                    if (now >= startTime && now <= endTime) {
                      return "bg-green-100 text-green-800"
                    } else if (now < startTime) {
                      return "bg-yellow-100 text-yellow-800"
                    } else {
                      return "bg-gray-100 text-gray-800"
                    }
                  })()
                }`}
              >
                {(() => {
                  const now = new Date()
                  const startTime = new Date(exam.startTime)
                  const endTime = new Date(exam.endTime)
                  
                  if (now >= startTime && now <= endTime) {
                    return "Active"
                  } else if (now < startTime) {
                    return "Upcoming"
                  } else {
                    return "Ended"
                  }
                })()}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {exam.durationMin || exam.duration} minutes
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FileText className="h-4 w-4 mr-2" />
                {exam.totalMarks} marks
              </div>
              {exam.startTime && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Start: {new Date(exam.startTime).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(exam)}
                    className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/admin/exam/${exam.id}/results`)}
                    className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Results
                  </button>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No exams found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingExam ? "Edit Exam" : "Create New Exam"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter exam title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.durationMin}
                    onChange={(e) => setFormData({ ...formData, durationMin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) => {
                    console.log("Start time changed:", e.target.value)
                    setFormData({ ...formData, startTime: e.target.value })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">When students can start taking this exam</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                <div className="space-y-2">
                  <input
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) => {
                      console.log("End time changed:", e.target.value)
                      setFormData({ ...formData, endTime: e.target.value })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const startTime = new Date(formData.startTime)
                        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000) // 30 minutes
                        setFormData({ ...formData, endTime: formatDateTime(endTime) })
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      30 min
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const startTime = new Date(formData.startTime)
                        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour
                        setFormData({ ...formData, endTime: formatDateTime(endTime) })
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      1 hour
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const startTime = new Date(formData.startTime)
                        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000) // 2 hours
                        setFormData({ ...formData, endTime: formatDateTime(endTime) })
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      2 hours
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const startTime = new Date(formData.startTime)
                        const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000) // 3 hours
                        setFormData({ ...formData, endTime: formatDateTime(endTime) })
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      3 hours
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">When this exam will close for students</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Saving..." : editingExam ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamManagement
