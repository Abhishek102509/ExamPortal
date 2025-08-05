"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { examAPI, questionAPI } from "../../services/api"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Clock, FileText, CheckCircle, XCircle, ArrowLeft, ArrowRight, Play, Send } from "lucide-react"
import { Container, Row, Col, Card, Button, Badge, Spinner, Form } from "react-bootstrap"

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
      
      // First get detailed exam data with questions
      const questionsResponse = await questionAPI.getQuestionsByExam(exam.id)
      console.log("=== START EXAM DEBUG ===")
      console.log("Exam:", exam)
      console.log("Questions from API:", questionsResponse.data)
      console.log("Questions count:", questionsResponse.data.length)
      
      if (questionsResponse.data && questionsResponse.data.length > 0) {
        setQuestions(questionsResponse.data)
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
    // Check if all questions are answered
    if (Object.keys(answers).length !== questions.length) {
      toast.error("Please answer all questions before submitting the exam.")
      return
    }
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

        const response = await examAPI.submitExam(submissionData)
        
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
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  if (!examStarted) {
    return (
<Container className="mt-4">
        <Row className="mb-3">
          <Col>
            <h1 className="display-6">Available Exams</h1>
            <p className="text-muted">Select an exam to begin</p>
          </Col>
        </Row>

        <Row xs={1} md={2} lg={3} className="g-4">
          {exams.map((exam) => (
            <Col key={exam.id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{exam.title}</Card.Title>
                  <Card.Text>{exam.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <Badge bg="info" className="me-2">
                      <Clock className="me-1" />
                      Duration: {exam.durationMin || exam.duration} minutes
                    </Badge>
                    <Badge bg="info">
                      <FileText className="me-1" />
                      Total Marks: {exam.totalMarks}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <Badge bg="success">Active</Badge>
                    <span className="ms-2 text-muted">
                      Ends: {new Date(exam.endTime).toLocaleDateString()}
                    </span>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Button
                    onClick={() => startExam(exam)}
                    variant="primary"
                    className="w-100"
                  >
                    Start Exam
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>

        {exams.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h1 text-muted mx-auto mb-4" />
            <p className="text-muted">No exams available at the moment</p>
          </div>
        )}
      </Container>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <Container className="mt-4">
      {/* Exam Header */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col sm={12} md={6}>
              <h1 className="h4 mb-1">{selectedExam.title}</h1>
              <p className="text-muted mb-0">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </Col>
            <Col sm={12} md={6} className="d-flex justify-content-md-end gap-3 mt-3 mt-md-0">
              <Badge bg={timeLeft < 300 ? "danger" : "primary"} className="p-2">
                <Clock size={16} className="me-2" />
                {formatTime(timeLeft)}
              </Badge>
              <Badge bg="secondary" className="p-2">
                Answered: {getAnsweredCount()}/{questions.length}
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Question */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <Badge bg="primary" className="me-3">
              Question {currentQuestion + 1}
            </Badge>
            <span className="text-muted small">{currentQ?.marks} marks</span>
          </div>

          <h2 className="h5 mb-4">{currentQ?.questionText}</h2>

          <Form>
            {[
              { key: 'A', value: currentQ?.optionA },
              { key: 'B', value: currentQ?.optionB },
              { key: 'C', value: currentQ?.optionC },
              { key: 'D', value: currentQ?.optionD }
            ].map((option, index) => {
              // Check if this option is selected by comparing the stored answer (A, B, C, D) with the option key
              const isSelected = answers[currentQ?.id] === option.key
              
              return (
                <div key={index} className="mb-3">
                  <Form.Check
                    type="radio"
                    id={`option-${currentQ?.id}-${option.key}`}
                    name={`question-${currentQ?.id}`}
                    value={option.value}
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(currentQ?.id, option.value)}
                    label={`${option.key}. ${option.value}`}
                    className={isSelected ? "border border-primary rounded p-2 bg-light" : "border rounded p-2"}
                  />
                </div>
              )
            })}
          </Form>
        </Card.Body>
      </Card>

      {/* Navigation */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          variant="outline-secondary"
        >
          <ArrowLeft size={16} className="me-2" />
          Previous
        </Button>

        <div className="d-flex gap-3">
          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmitExam}
              disabled={submitting}
              variant="success"
            >
              <Send size={16} className="me-2" />
              {submitting ? "Submitting..." : "Submit Exam"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
              variant="primary"
            >
              Next
              <ArrowRight size={16} className="ms-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Question Navigator */}
      <Card>
        <Card.Body>
          <h3 className="h6 mb-3">Question Navigator</h3>
          <Row xs={10} className="g-2">
            {questions.map((_, index) => {
              const question = questions[index]
              const isAnswered = answers[question?.id] && answers[question?.id] !== ""
              
              return (
                <Col key={index}>
                  <Button
                    size="sm"
                    onClick={() => setCurrentQuestion(index)}
                    variant={
                      index === currentQuestion
                        ? "primary"
                        : isAnswered
                          ? "success"
                          : "outline-secondary"
                    }
                    className="w-100 p-1"
                    style={{ minHeight: '32px', fontSize: '0.75rem' }}
                  >
                    {index + 1}
                  </Button>
                </Col>
              )
            })}
          </Row>

          <div className="d-flex justify-content-center gap-4 mt-4 small">
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded me-2" style={{ width: '12px', height: '12px' }}></div>
              Current
            </div>
            <div className="d-flex align-items-center">
              <div className="bg-success rounded me-2" style={{ width: '12px', height: '12px' }}></div>
              Answered
            </div>
            <div className="d-flex align-items-center">
              <div className="border rounded me-2" style={{ width: '12px', height: '12px' }}></div>
              Not Answered
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default TakeExam
