import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Container, Row, Col, Card, Badge, Spinner, Table, Tabs, Tab, ProgressBar } from 'react-bootstrap'
import { resultAPI, examAPI } from "../../services/api"
import { toast } from "react-hot-toast"
import { FileText, Clock, CheckCircle, XCircle, Award, TrendingUp, Users, UserCheck, UserX, BarChart3 } from "lucide-react"

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

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "PASSED":
        return "success"
      case "FAILED":
        return "danger"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "PASSED":
        return <CheckCircle size={18} className="text-success" />
      case "FAILED":
        return <XCircle size={18} className="text-danger" />
      default:
        return <Clock size={18} className="text-secondary" />
    }
  }

  const calculateStats = () => {
    console.log("=== CALCULATE STATS DEBUG ===")
    console.log("Results array:", results)
    console.log("Results length:", results.length)
    
    if (results.length === 0) return { total: 0, passed: 0, failed: 0, average: 0 }
    
    // Debug each result status
    results.forEach((result, index) => {
      console.log(`Result ${index}:`, {
        id: result.id,
        username: result.username,
        status: result.status,
        percentage: result.percentage,
        obtainedMarks: result.obtainedMarks,
        totalMarks: result.totalMarks
      })
    })
    
    const passed = results.filter(r => r.status === "PASSED").length
    const failed = results.filter(r => r.status === "FAILED").length
    const average = results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length
    
    console.log("Stats calculated:", { total: results.length, passed, failed, average: average.toFixed(1) })
    
    return {
      total: results.length,
      passed,
      failed,
      average: average.toFixed(1)
    }
  }

  const stats = calculateStats()
  const passedStudents = results.filter(r => r.status === "PASSED")
  const failedStudents = results.filter(r => r.status === "FAILED")

  if (loading) {
    return (
      <Container className="d-flex align-items-center justify-content-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="text-white bg-primary">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h1 className="display-6 mb-2">{exam?.title} - Results</h1>
                  <p className="lead mb-0">
                    Subject: {exam?.subject} | Duration: {exam?.durationMin || exam?.duration} minutes | Total Marks: {exam?.totalMarks}
                  </p>
                </div>
                <Award size={48} className="text-white opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1">Total Submissions</p>
                <h3 className="mb-0">{stats.total}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                <Users size={24} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1">Passed</p>
                <h3 className="text-success mb-0">{stats.passed}</h3>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                <UserCheck size={24} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1">Failed</p>
                <h3 className="text-danger mb-0">{stats.failed}</h3>
              </div>
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                <UserX size={24} className="text-danger" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1">Average Score</p>
                <h3 className="text-warning mb-0">{stats.average}%</h3>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                <BarChart3 size={24} className="text-warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Results with Pass/Fail Tabs */}
      {results.length === 0 ? (
        <Row>
          <Col>
            <Card>
              <Card.Body className="text-center py-5">
                <FileText size={48} className="text-muted mb-3" />
                <h5>No Submissions Found</h5>
                <p className="text-muted">No students have submitted this exam yet.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Student Results</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Tabs defaultActiveKey="all" className="nav-fill">
                  <Tab eventKey="all" title={`All Students (${stats.total})`}>
                    <Table responsive hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Student Name</th>
                          <th>Score</th>
                          <th>Percentage</th>
                          <th>Status</th>
                          <th>Progress</th>
                          <th>Submitted Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((result) => (
                          <tr key={result.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                {getStatusIcon(result.status)}
                                <span className="ms-2 fw-medium">{result.username}</span>
                              </div>
                            </td>
                            <td className="fw-bold">{result.obtainedMarks}/{result.totalMarks}</td>
                            <td className="fw-bold">{result.percentage?.toFixed(1)}%</td>
                            <td>
                              <Badge bg={getStatusBadge(result.status)}>
                                {result.status}
                              </Badge>
                            </td>
                            <td style={{ width: '150px' }}>
                              <ProgressBar 
                                now={result.percentage} 
                                variant={result.percentage >= 50 ? 'success' : 'danger'}
                                style={{ height: '8px' }}
                              />
                            </td>
                            <td>
                              {result.submittedAt ? new Date(result.submittedAt).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>
                  
                  <Tab eventKey="passed" title={`Passed (${stats.passed})`}>
                    <Table responsive hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Student Name</th>
                          <th>Score</th>
                          <th>Percentage</th>
                          <th>Progress</th>
                          <th>Submitted Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {passedStudents.map((result) => (
                          <tr key={result.id} className="table-success-subtle">
                            <td>
                              <div className="d-flex align-items-center">
                                <CheckCircle size={18} className="text-success me-2" />
                                <span className="fw-medium">{result.username}</span>
                              </div>
                            </td>
                            <td className="fw-bold">{result.obtainedMarks}/{result.totalMarks}</td>
                            <td className="fw-bold text-success">{result.percentage?.toFixed(1)}%</td>
                            <td style={{ width: '150px' }}>
                              <ProgressBar 
                                now={result.percentage} 
                                variant="success"
                                style={{ height: '8px' }}
                              />
                            </td>
                            <td>
                              {result.submittedAt ? new Date(result.submittedAt).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {passedStudents.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-muted">No students passed this exam.</p>
                      </div>
                    )}
                  </Tab>
                  
                  <Tab eventKey="failed" title={`Failed (${stats.failed})`}>
                    <Table responsive hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Student Name</th>
                          <th>Score</th>
                          <th>Percentage</th>
                          <th>Progress</th>
                          <th>Submitted Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {failedStudents.map((result) => (
                          <tr key={result.id} className="table-danger-subtle">
                            <td>
                              <div className="d-flex align-items-center">
                                <XCircle size={18} className="text-danger me-2" />
                                <span className="fw-medium">{result.username}</span>
                              </div>
                            </td>
                            <td className="fw-bold">{result.obtainedMarks}/{result.totalMarks}</td>
                            <td className="fw-bold text-danger">{result.percentage?.toFixed(1)}%</td>
                            <td style={{ width: '150px' }}>
                              <ProgressBar 
                                now={result.percentage} 
                                variant="danger"
                                style={{ height: '8px' }}
                              />
                            </td>
                            <td>
                              {result.submittedAt ? new Date(result.submittedAt).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {failedStudents.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-muted">No students failed this exam.</p>
                      </div>
                    )}
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default ExamResults
