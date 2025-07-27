"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { resultAPI } from "../../services/api"
import { toast } from "react-hot-toast"
import { FileText, Clock, CheckCircle, XCircle, Award, TrendingUp } from "lucide-react"

const ExamResults = () => {
  const { user } = useAuth()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await resultAPI.getMyResults()
      console.log("=== EXAM RESULTS DEBUG ===")
      console.log("Results response:", response.data)
      setResults(response.data || [])
    } catch (error) {
      console.error("Error fetching results:", error)
      toast.error("Failed to fetch results")
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
        <h1 className="text-2xl font-bold text-gray-900">My Exam Results</h1>
        <p className="text-gray-600">View your exam performance and scores</p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No exam results found</p>
          <p className="text-sm text-gray-400 mt-2">Complete some exams to see your results here</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {results.map((result) => (
            <div key={result.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.examTitle}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Score: {result.totalScore}/{result.totalMarks}</span>
                    <span>Percentage: {result.percentage?.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(result.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Award className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Total Score</p>
                    <p className="text-lg font-bold text-blue-700">{result.totalScore}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Percentage</p>
                    <p className="text-lg font-bold text-green-700">{result.percentage?.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Total Marks</p>
                    <p className="text-lg font-bold text-purple-700">{result.totalMarks}</p>
                  </div>
                </div>
              </div>

              {result.submittedAt && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Submitted on: {new Date(result.submittedAt).toLocaleDateString()} at{" "}
                    {new Date(result.submittedAt).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExamResults
