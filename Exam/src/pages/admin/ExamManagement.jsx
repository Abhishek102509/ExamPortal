"use client"

import { useState, useEffect } from "react"
import { examAPI } from "../../services/api"
import toast from "react-hot-toast"
import { Plus, Edit, Trash2, Clock, FileText, Search, Calendar, Eye, XCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Button, Form, Modal, Badge, Spinner, InputGroup } from "react-bootstrap"

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
        startTime: formData.startTime,
        endTime: formData.endTime,
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
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '16rem' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
            <div>
              <h1 className="h2 fw-bold text-dark mb-1">Exam Management</h1>
              <p className="text-muted mb-0">Create and manage examinations</p>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="success"
                size="sm"
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
              >
                Quick Test
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
              >
                <Plus className="me-2" size={16} />
                Create Exam
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Exams Grid */}
      <Row>
        {filteredExams.map((exam) => (
          <Col md={6} lg={4} key={exam.id} className="mb-4">
            <Card className="h-100 shadow-sm border-0 shadow-hover">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <Card.Title className="h5 mb-2">{exam.title}</Card.Title>
                    <Card.Subtitle className="text-muted mb-2">Subject: {exam.subject}</Card.Subtitle>
                    {exam.description && (
                      <Card.Text className="small text-muted">{exam.description}</Card.Text>
                    )}
                  </div>
                  <Badge 
                    bg={(() => {
                      const now = new Date()
                      const startTime = new Date(exam.startTime)
                      const endTime = new Date(exam.endTime)
                      
                      if (now >= startTime && now <= endTime) {
                        return "success"
                      } else if (now < startTime) {
                        return "warning"
                      } else {
                        return "secondary"
                      }
                    })()}
                    className="ms-2"
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
                  </Badge>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center text-muted small mb-2">
                    <Clock className="me-2" size={16} />
                    {exam.durationMin || exam.duration} minutes
                  </div>
                  <div className="d-flex align-items-center text-muted small mb-2">
                    <FileText className="me-2" size={16} />
                    {exam.totalMarks} marks
                  </div>
                  {exam.startTime && (
                    <div className="d-flex align-items-center text-muted small">
                      <Calendar className="me-2" size={16} />
                      Start: {new Date(exam.startTime).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2 pt-3 border-top">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(exam)}
                  >
                    <Edit className="me-1" size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => navigate(`/admin/exam/${exam.id}/results`)}
                  >
                    <Eye className="me-1" size={14} />
                    Results
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(exam.id)}
                  >
                    <Trash2 className="me-1" size={14} />
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredExams.length === 0 && (
        <div className="text-center py-5">
          <FileText className="text-muted mb-3" size={48} />
          <p className="text-muted">No exams found</p>
        </div>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="md">
        <Modal.Header closeButton>
          <Modal.Title>{editingExam ? "Edit Exam" : "Create New Exam"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter exam title"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Subject *</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Enter subject"
                />
              </Form.Group>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Duration (minutes) *</Form.Label>
                    <Form.Control
                      type="number"
                      required
                      min="1"
                      value={formData.durationMin}
                      onChange={(e) => setFormData({ ...formData, durationMin: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Total Marks *</Form.Label>
                    <Form.Control
                      type="number"
                      required
                      min="1"
                      value={formData.totalMarks}
                      onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Start Time *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) => {
                    console.log("Start time changed:", e.target.value)
                    setFormData({ ...formData, startTime: e.target.value })
                  }}
                />
                <Form.Text className="text-muted">When students can start taking this exam</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>End Time *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  required
                  value={formData.endTime}
                  onChange={(e) => {
                    console.log("End time changed:", e.target.value)
                    setFormData({ ...formData, endTime: e.target.value })
                  }}
                  className="mb-2"
                />
                <div className="d-flex flex-wrap gap-2 mb-2">
                  <Button
                    type="button"
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      const startTime = new Date(formData.startTime)
                      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000) // 30 minutes
                      setFormData({ ...formData, endTime: formatDateTime(endTime) })
                    }}
                  >
                    30 min
                  </Button>
                  <Button
                    type="button"
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      const startTime = new Date(formData.startTime)
                      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour
                      setFormData({ ...formData, endTime: formatDateTime(endTime) })
                    }}
                  >
                    1 hour
                  </Button>
                  <Button
                    type="button"
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      const startTime = new Date(formData.startTime)
                      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000) // 2 hours
                      setFormData({ ...formData, endTime: formatDateTime(endTime) })
                    }}
                  >
                    2 hours
                  </Button>
                  <Button
                    type="button"
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      const startTime = new Date(formData.startTime)
                      const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000) // 3 hours
                      setFormData({ ...formData, endTime: formatDateTime(endTime) })
                    }}
                  >
                    3 hours
                  </Button>
                </div>
                <Form.Text className="text-muted">When this exam will close for students</Form.Text>
              </Form.Group>

              <div className="d-flex justify-content-end gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : editingExam ? "Update" : "Create"}
                </Button>
              </div>
            </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default ExamManagement
