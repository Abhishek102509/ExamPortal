import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Button, Badge, Spinner, Table, ProgressBar } from 'react-bootstrap'
import { examAPI, resultAPI } from "../../services/api"
import { FileText, Eye, Calendar, Clock, Users, Award, TrendingUp, BarChart3 } from "lucide-react"
import toast from "react-hot-toast"

const AllExamResults = () => {
  const [exams, setExams] = useState([])
  const [examStats, setExamStats] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchExamsAndResults()
  }, [])

  const fetchExamsAndResults = async () => {
    try {
      setLoading(true)
      
      // Fetch all exams
      const examsRes = await examAPI.getAllExams()
      const examsData = examsRes.data || []
      
      setExams(examsData)
      
      // Fetch results for each exam
      const statsPromises = examsData.map(async (exam) => {
        try {
          const resultsRes = await resultAPI.getResultsByExam(exam.id)
          const results = resultsRes.data || []
          
          const totalSubmissions = results.length
          const passed = results.filter(r => r.status === "PASSED").length
          const failed = results.filter(r => r.status === "FAILED").length
          const average = totalSubmissions > 0 
            ? results.reduce((sum, r) => sum + (r.percentage || 0), 0) / totalSubmissions 
            : 0
          
          return {
            examId: exam.id,
            totalSubmissions,
            passed,
            failed,
            average: average.toFixed(1)
          }
        } catch (error) {
          console.error(`Error fetching results for exam ${exam.id}:`, error)
          return {
            examId: exam.id,
            totalSubmissions: 0,
            passed: 0,
            failed: 0,
            average: 0
          }
        }
      })
      
      const statsArray = await Promise.all(statsPromises)
      const statsMap = {}
      statsArray.forEach(stat => {
        statsMap[stat.examId] = stat
      })
      
      setExamStats(statsMap)
    } catch (error) {
      console.error("Error fetching exams and results:", error)
      toast.error("Failed to load exam results")
    } finally {
      setLoading(false)
    }
  }

  const getExamStatus = (exam) => {
    const now = new Date()
    const startTime = new Date(exam.startTime)
    const endTime = new Date(exam.endTime)
    
    if (now >= startTime && now <= endTime) {
      return { status: "Active", color: "success" }
    } else if (now < startTime) {
      return { status: "Upcoming", color: "warning" }
    } else {
      return { status: "Completed", color: "secondary" }
    }
  }

  if (loading) {
    return (
      <Container className="d-flex align-items-center justify-content-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card className="text-white bg-primary mb-4">
            <Card.Body>
              <h1 className="display-5">All Exam Results</h1>
              <p className="lead">View and manage results for all exams</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {exams.length === 0 ? (
        <Row>
          <Col>
            <Card>
              <Card.Body className="text-center py-5">
                <FileText size={48} className="text-muted mb-3" />
                <h5>No Exams Found</h5>
                <p className="text-muted">Create an exam first to view results.</p>
                <Button variant="primary" onClick={() => navigate('/admin/exams')}>
                  Create Exam
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Exam Results Overview</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Exam Details</th>
                      <th>Status</th>
                      <th>Submissions</th>
                      <th>Pass Rate</th>
                      <th>Average Score</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam) => {
                      const status = getExamStatus(exam)
                      const stats = examStats[exam.id] || { totalSubmissions: 0, passed: 0, failed: 0, average: 0 }
                      const passRate = stats.totalSubmissions > 0 ? ((stats.passed / stats.totalSubmissions) * 100).toFixed(1) : 0
                      
                      return (
                        <tr key={exam.id}>
                          <td>
                            <div>
                              <h6 className="mb-1">{exam.title}</h6>
                              <small className="text-muted">
                                <strong>Subject:</strong> {exam.subject} | 
                                <strong> Duration:</strong> {exam.durationMin || exam.duration} min | 
                                <strong> Total Marks:</strong> {exam.totalMarks}
                              </small>
                              {exam.startTime && (
                                <div className="mt-1">
                                  <small className="text-muted">
                                    <Calendar size={14} className="me-1" />
                                    {new Date(exam.startTime).toLocaleDateString()} - {new Date(exam.endTime).toLocaleDateString()}
                                  </small>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <Badge bg={status.color}>{status.status}</Badge>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Users size={16} className="me-2 text-muted" />
                              <span className="fw-bold">{stats.totalSubmissions}</span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <TrendingUp size={16} className="me-2 text-muted" />
                              <span className={`fw-bold ${passRate >= 70 ? 'text-success' : passRate >= 50 ? 'text-warning' : 'text-danger'}`}>
                                {passRate}%
                              </span>
                            </div>
                            <small className="text-muted">
                              {stats.passed} passed, {stats.failed} failed
                            </small>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Award size={16} className="me-2 text-muted" />
                              <span className={`fw-bold ${stats.average >= 70 ? 'text-success' : stats.average >= 50 ? 'text-warning' : 'text-danger'}`}>
                                {stats.average}%
                              </span>
                            </div>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => navigate(`/admin/exam/${exam.id}/results`)}
                              disabled={stats.totalSubmissions === 0}
                            >
                              <Eye size={14} className="me-1" />
                              View Details
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Summary Statistics */}
      {exams.length > 0 && (
        <Row className="mt-4">
          <Col md={3}>
            <Card>
              <Card.Body className="text-center">
                <FileText size={24} className="text-primary mb-2" />
                <h4>{exams.length}</h4>
                <p className="text-muted mb-0">Total Exams</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body className="text-center">
                <Users size={24} className="text-info mb-2" />
                <h4>{Object.values(examStats).reduce((sum, stat) => sum + stat.totalSubmissions, 0)}</h4>
                <p className="text-muted mb-0">Total Submissions</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body className="text-center">
                <TrendingUp size={24} className="text-success mb-2" />
                <h4>{Object.values(examStats).reduce((sum, stat) => sum + stat.passed, 0)}</h4>
                <p className="text-muted mb-0">Students Passed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body className="text-center">
                <Award size={24} className="text-warning mb-2" />
                <h4>
                  {exams.length > 0 && Object.values(examStats).length > 0 
                    ? (Object.values(examStats).reduce((sum, stat) => sum + parseFloat(stat.average), 0) / Object.values(examStats).length).toFixed(1)
                    : 0}%
                </h4>
                <p className="text-muted mb-0">Overall Average</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default AllExamResults
