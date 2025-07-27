"use client"

import { useState, useEffect } from "react"
import { questionAPI, examAPI } from "../../services/api"
import toast from "react-hot-toast"
import { Plus, Edit, Trash2, Search, HelpCircle, CheckCircle } from "lucide-react"

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [selectedExam, setSelectedExam] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    examId: "",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "",
    marks: "",
  })

  useEffect(() => {
    fetchExams()
  }, [])

  useEffect(() => {
    if (selectedExam) {
      fetchQuestions(selectedExam)
    }
  }, [selectedExam])

  const fetchExams = async () => {
    try {
      const response = await examAPI.getAllExams()
      setExams(response.data)
      if (response.data.length > 0) {
        setSelectedExam(response.data[0].id)
      }
    } catch (error) {
      toast.error("Failed to fetch exams")
    } finally {
      setLoading(false)
    }
  }

  const fetchQuestions = async (examId) => {
    try {
      const response = await questionAPI.getQuestionsByExam(examId)
      setQuestions(response.data)
    } catch (error) {
      toast.error("Failed to fetch questions")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const questionData = {
        ...formData,
        examId: parseInt(selectedExam),
        marks: parseInt(formData.marks),
      }

      if (editingQuestion) {
        await questionAPI.updateQuestion(editingQuestion.id, questionData)
        toast.success("Question updated successfully")
      } else {
        await questionAPI.createQuestion(questionData)
        toast.success("Question created successfully")
      }

      fetchQuestions(selectedExam)
      setShowModal(false)
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (question) => {
    setEditingQuestion(question)
    setFormData({
      examId: question.examId,
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctOption: question.correctOption,
      marks: question.marks?.toString() || "",
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await questionAPI.deleteQuestion(id)
        toast.success("Question deleted successfully")
        fetchQuestions(selectedExam)
      } catch (error) {
        toast.error("Failed to delete question")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      examId: "",
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOption: "",
      marks: "",
    })
    setEditingQuestion(null)
  }

  const filteredQuestions = questions.filter((question) =>
    question.questionText?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedExamData = exams.find((exam) => exam.id === parseInt(selectedExam))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Question Management</h1>
          <p className="text-gray-600">Create and manage exam questions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={!selectedExam}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </button>
      </div>

      {/* Exam Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose an exam</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>

          {selectedExamData && (
            <div className="bg-blue-50 rounded-lg p-4 min-w-0 sm:min-w-[200px]">
              <p className="text-sm font-medium text-blue-900">{selectedExamData.title}</p>
              <p className="text-xs text-blue-700">
                {selectedExamData.durationMin || selectedExamData.duration} min • {selectedExamData.totalMarks} marks
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedExam && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                        Q{index + 1}
                      </span>
                      <span className="text-sm text-gray-500">{question.marks} marks</span>
                    </div>
                    <p className="text-gray-900 font-medium mb-4">{question.questionText}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        { key: 'A', value: question.optionA },
                        { key: 'B', value: question.optionB },
                        { key: 'C', value: question.optionC },
                        { key: 'D', value: question.optionD }
                      ].map((option) => (
                        <div
                          key={option.key}
                          className={`flex items-center p-2 rounded-lg border ${
                            question.correctOption === option.key
                              ? "bg-green-50 border-green-200 text-green-800"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          {question.correctOption === option.key && (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          )}
                          <span className="text-sm">
                            {option.key}. {option.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(question)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No questions found for this exam</p>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text *</label>
                <textarea
                  required
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter the question..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Option A *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionA}
                    onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter option A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Option B *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionB}
                    onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter option B"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Option C *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionC}
                    onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter option C"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Option D *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionD}
                    onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter option D"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Option *</label>
                  <select
                    required
                    value={formData.correctOption}
                    onChange={(e) => setFormData({ ...formData, correctOption: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select correct option</option>
                    <option value="A">A. {formData.optionA}</option>
                    <option value="B">B. {formData.optionB}</option>
                    <option value="C">C. {formData.optionC}</option>
                    <option value="D">D. {formData.optionD}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marks *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  {loading ? "Saving..." : editingQuestion ? "Update" : "Add Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionManagement
