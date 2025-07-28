import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { resultAPI, examAPI } from "../../services/api"
import { toast } from "react-hot-toast"
import { FileText, Clock, CheckCircle, XCircle, Award, TrendingUp, Users } from "lucide-react"

const ExamResults = () => {
  const { examId } = useParams()
  const [results, setResults] = useState([])
  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExamResults()
  }, [examId])

  const fetchExamResults = async () => {
    try {
      setLoading(true)
      const [resultsRes, examRes] = await Promise.all([
        resultAPI.getResultsByExam(examId),
        examAPI.getExamById(examId)
      ])
      
      console.log("=== EXAM RESULTS DEBUG ===")
      console.log("Results:", resultsRes.data)
      console.log("Exam:", examRes.data)
      
      setResults(resultsRes.data || [])
      setExam(examRes.data)
    } catch (error) {
      console.error("Error fetching exam results:", error)
      toast.error("Failed to fetch exam results")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PASSED":
        return "bg-green-100 text-green-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "PASSED":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "FAILED":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const calculateStats = () => {
    if (results.length === 0) return { total: 0, passed: 0, failed: 0, average: 0 }
    
    const passed = results.filter(r => r.status === "PASSED").length
    const failed = results.filter(r => r.status === "FAILED").length
    const average = results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length
    
    return {
      total: results.length,
      passed,
      failed,
      average: average.toFixed(1)
    }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
        <p className="text-gray-600">
          {exam?.title} - {results.length} submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Passed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.passed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.failed}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.average}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      {results.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No submissions for this exam yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Student Submissions</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {results.map((result) => (
              <div key={result.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{result.username}</h3>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Score: {result.totalScore}/{result.totalMarks}</span>
                      <span>Percentage: {result.percentage?.toFixed(1)}%</span>
                      {result.createdOn && (
                        <span>Submitted: {new Date(result.createdOn).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                      {result.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        result.percentage >= 50 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${result.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamResults 