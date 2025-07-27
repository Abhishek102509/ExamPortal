"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { examAPI, questionAPI } from "../../services/api"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Clock, FileText, CheckCircle, XCircle, ArrowLeft, ArrowRight, Play, Send } from "lucide-react"

const TakeExam = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [examStarted, setExamStarted] = useState(false)
  const [selectedExam, setSelectedExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAvailableExams()
  }, [])

  useEffect(() => {
    let timer
    if (examStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [examStarted, timeLeft])

  const fetchAvailableExams = async () => {
    try {
      const response = await examAPI.getActiveExams()
      console.log("Active exams from API:", response.data)
      setExams(response.data)
    } catch (error) {
      console.error("Error fetching active exams:", error)
      toast.error("Failed to fetch exams")
    } finally {
      setLoading(false)
    }
  }

  const startExam = async (exam) => {
    try {
      setLoading(true)
      const response = await questionAPI.getQuestionsByExam(exam.id)
      console.log("=== START EXAM DEBUG ===")
      console.log("Exam:", exam)
      console.log("Questions loaded:", response.data)
      console.log("Questions count:", response.data?.length || 0)
      
      if (response.data && response.data.length > 0) {
        setQuestions(response.data)
        setSelectedExam(exam)
        setTimeLeft((exam.durationMin || exam.duration) * 60) // Convert minutes to seconds
        setExamStarted(true)
        setCurrentQuestion(0)
        setAnswers({})
      } else {
        toast.error("No questions found for this exam")
      }
    } catch (error) {
      console.error("Error starting exam:", error)
      toast.error("Failed to start exam")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId, answer) => {
    // Convert the answer text to the corresponding option letter (A, B, C, D)
    const question = questions.find(q => q.id === parseInt(questionId))
    let selectedOption = ''
    
    if (question) {
      if (answer === question.optionA) selectedOption = 'A'
      else if (answer === question.optionB) selectedOption = 'B'
      else if (answer === question.optionC) selectedOption = 'C'
      else if (answer === question.optionD) selectedOption = 'D'
    }
    
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }))
  }

  const handleSubmitExam = async () => {
    if (window.confirm("Are you sure you want to submit the exam?")) {
      setSubmitting(true)
      try {
        const submissionData = {
          examId: selectedExam.id,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId: parseInt(questionId),
            selectedOption: answer, // This should be A, B, C, or D
          })),
        }

        console.log("=== EXAM SUBMISSION DEBUG ===")
        console.log("Selected exam:", selectedExam)
        console.log("Answers object:", answers)
        console.log("Submission data:", submissionData)
        console.log("User ID:", user?.id)
        console.log("Auth token:", localStorage.getItem("token") ? "Present" : "Missing")
        
        // Debug each answer
        console.log("=== ANSWER DEBUG ===")
        Object.entries(answers).forEach(([questionId, answer]) => {
          const question = questions.find(q => q.id === parseInt(questionId))
          console.log(`Question ${questionId}:`, {
            questionText: question?.questionText,
            correctOption: question?.correctOption,
            selectedOption: answer,
            isCorrect: question?.correctOption === answer
          })
        })

        const response = await examAPI.submitExam(submissionData)
        console.log("=== SUBMISSION RESPONSE ===")
        console.log("Response:", response)
        console.log("Response data:", response.data)
        
        toast.success("Exam submitted successfully!")

        // Reset state
        setExamStarted(false)
        setSelectedExam(null)
        setQuestions([])
        setAnswers({})
        setCurrentQuestion(0)
        fetchAvailableExams()
        navigate('/student/results')
      } catch (error) {
        console.error("=== SUBMISSION ERROR DEBUG ===")
        console.error("Error object:", error)
        console.error("Error response:", error.response)
        console.error("Error data:", error.response?.data)
        console.error("Error status:", error.response?.status)
        console.error("Error message:", error.message)
        toast.error(error.response?.data?.message || "Failed to submit exam")
      } finally {
        setSubmitting(false)
      }
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const getAnsweredCount = () => {
    return Object.values(answers).filter((answer) => answer !== "" && answer !== null).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!examStarted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Exams</h1>
          <p className="text-gray-600">Select an exam to begin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
                <p className="text-gray-600 text-sm">{exam.description}</p>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration: {exam.durationMin || exam.duration} minutes
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="h-4 w-4 mr-2" />
                  Total Marks: {exam.totalMarks}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Active
                  </span>
                  <span className="ml-2">
                    Ends: {new Date(exam.endTime).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => startExam(exam)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Exam
              </button>
            </div>
          ))}
        </div>

        {exams.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No exams available at the moment</p>
          </div>
        )}
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="space-y-6">
      {/* Exam Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{selectedExam.title}</h1>
            <p className="text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center px-3 py-2 rounded-lg ${
                timeLeft < 300 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              <Clock className="h-4 w-4 mr-2" />
              {formatTime(timeLeft)}
            </div>

            <div className="bg-gray-100 px-3 py-2 rounded-lg">
              <span className="text-sm font-medium">
                Answered: {getAnsweredCount()}/{questions.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
              Question {currentQuestion + 1}
            </span>
            <span className="text-sm text-gray-500">{currentQ?.marks} marks</span>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-6">{currentQ?.questionText}</h2>

          <div className="space-y-3">
            {[
              { key: 'A', value: currentQ?.optionA },
              { key: 'B', value: currentQ?.optionB },
              { key: 'C', value: currentQ?.optionC },
              { key: 'D', value: currentQ?.optionD }
            ].map((option, index) => {
              // Check if this option is selected by comparing the stored answer (A, B, C, D) with the option key
              const isSelected = answers[currentQ?.id] === option.key
              
              return (
                <label
                  key={index}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ?.id}`}
                    value={option.value}
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(currentQ?.id, option.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-900">
                    {option.key}. {option.value}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        <div className="flex space-x-3">
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmitExam}
              disabled={submitting}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? "Submitting..." : "Submit Exam"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>

      {/* Question Navigator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Question Navigator</h3>
        <div className="grid grid-cols-10 gap-2">
          {questions.map((_, index) => {
            const question = questions[index]
            const isAnswered = answers[question?.id] && answers[question?.id] !== ""
            
            return (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                  index === currentQuestion
                    ? "bg-blue-600 text-white"
                    : isAnswered
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
            Current
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
            Answered
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></div>
            Not Answered
          </div>
        </div>
      </div>
    </div>
  )
}

export default TakeExam
