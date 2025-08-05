"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Spinner,
  InputGroup,
  FormControl,
  Card,
  Badge,
} from "react-bootstrap"
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
    if (selectedExam) fetchQuestions(selectedExam)
  }, [selectedExam])

  const fetchExams = async () => {
    try {
      const response = await examAPI.getAllExams()
      setExams(response.data)
      if (response.data.length > 0) setSelectedExam(response.data[0].id)
    } catch {
      toast.error("Failed to fetch exams")
    } finally {
      setLoading(false)
    }
  }

  const fetchQuestions = async (examId) => {
    try {
      const response = await questionAPI.getQuestionsByExam(examId)
      setQuestions(response.data)
    } catch {
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
      } catch {
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

  const filteredQuestions = questions.filter((q) =>
    q.questionText?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedExamData = exams.find((e) => e.id === parseInt(selectedExam))

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-3">
        <Col>
          <h2>Question Management</h2>
          <p className="text-muted">Create and manage exam questions</p>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setShowModal(true)} disabled={!selectedExam}>
            <Plus className="me-2" size={16} /> Add Question
          </Button>
        </Col>
      </Row>

      {/* Exam Selection */}
      <Form.Group className="mb-4">
        <Form.Label>Select Exam</Form.Label>
        <Form.Select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
          <option value="">Choose an exam</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </Form.Select>
        {selectedExamData && (
          <div className="mt-2 p-2 bg-light border rounded">
            <strong>{selectedExamData.title}</strong>
            <p className="mb-0 text-muted">
              {selectedExamData.durationMin || selectedExamData.duration} min • {selectedExamData.totalMarks} marks
            </p>
          </div>
        )}
      </Form.Group>

      {/* Search */}
      <InputGroup className="mb-3">
        <InputGroup.Text><Search size={16} /></InputGroup.Text>
        <FormControl
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* Question List */}
      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((q, index) => (
          <Card className="mb-3" key={q.id}>
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <Badge bg="primary" className="me-2">Q{index + 1}</Badge>
                  <span className="text-muted">{q.marks} marks</span>
                  <p className="mt-2 mb-2 fw-semibold">{q.questionText}</p>
                  <Row>
                    {["A", "B", "C", "D"].map((opt) => (
                      <Col sm={6} key={opt} className="mb-2">
                        <div
                          className={`p-2 border rounded ${
                            q.correctOption === opt ? "bg-success text-white" : "bg-light"
                          }`}
                        >
                          {q.correctOption === opt && <CheckCircle size={14} className="me-2" />}
                          {opt}. {q[`option${opt}`]}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Col>
                <Col sm="auto">
                  <Button variant="outline-primary" size="sm" onClick={() => handleEdit(q)} className="me-2">
                    <Edit size={16} />
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(q.id)}>
                    <Trash2 size={16} />
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="text-center text-muted py-4">
          <HelpCircle size={48} className="mb-3" />
          <p>No questions found for this exam.</p>
        </div>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingQuestion ? "Edit Question" : "Add New Question"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Question Text *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              />
            </Form.Group>

            <Row>
              {["A", "B", "C", "D"].map((opt) => (
                <Col md={6} key={opt}>
                  <Form.Group className="mb-3">
                    <Form.Label>Option {opt} *</Form.Label>
                    <Form.Control
                      required
                      value={formData[`option${opt}`]}
                      onChange={(e) =>
                        setFormData({ ...formData, [`option${opt}`]: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Correct Option *</Form.Label>
                  <Form.Select
                    required
                    value={formData.correctOption}
                    onChange={(e) => setFormData({ ...formData, correctOption: e.target.value })}
                  >
                    <option value="">Select correct option</option>
                    {["A", "B", "C", "D"].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}. {formData[`option${opt}`]}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marks *</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    required
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : editingQuestion ? "Update" : "Add Question"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default QuestionManagement
