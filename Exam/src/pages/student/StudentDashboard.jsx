"use client"

import React, { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap'
import { useAuth } from "../../contexts/AuthContext"
import { examAPI, resultAPI, queryAPI } from "../../services/api"
import { toast } from "react-hot-toast"
import { useNavigate, useLocation } from "react-router-dom"
import {
  FileText,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Calendar,
  Award,
  Play,
  BookOpen,
} from "lucide-react"

function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [stats, setStats] = useState({
    availableExams: 0,
    completedExams: 0,
    averageScore: 0,
    pendingQueries: 0,
  })
  const [recentExams, setRecentExams] = useState([])
  const [recentResults, setRecentResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [location.pathname]) // Refresh when location changes (e.g., returning from exam)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const [examsRes, resultsRes, queriesRes] = await Promise.all([
        examAPI.getActiveExams().catch((error) => {
          console.error("Error fetching active exams:", error)
          return { data: [] }
        }),
        resultAPI.getMyResults().catch((error) => {
          console.error("Error fetching results:", error)
          return { data: [] }
        }),
        queryAPI.getMyQueries().catch((error) => {
          console.error("Error fetching queries:", error)
          return { data: [] }
        }),
      ])

      // Check if exams data is valid
      if (!examsRes.data || !Array.isArray(examsRes.data)) {
        console.error("Invalid exams data:", examsRes.data)
        toast.error("Invalid exam data received")
        return
      }

      // Backend already filters for active exams, so we just need to filter out completed ones
      const activeExams = examsRes.data || []

      const completedExamIds = resultsRes.data?.map((result) => result.examId) || []
      
      const availableExams = activeExams.filter((exam) => !completedExamIds.includes(exam.id))

      const averageScore =
        resultsRes.data?.length > 0
          ? resultsRes.data.reduce((sum, result) => sum + (result.percentage || 0), 0) / resultsRes.data.length
          : 0

      setStats({
        availableExams: availableExams.length,
        completedExams: resultsRes.data?.length || 0,
        averageScore: Math.round(averageScore),
        pendingQueries: queriesRes.data?.filter((q) => q.status === "PENDING")?.length || 0,
      })

      setRecentExams(availableExams.slice(0, 5))
      setRecentResults(resultsRes.data?.slice(0, 5) || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Available Exams",
      value: stats.availableExams,
      icon: FileText,
      variant: "primary",
      action: () => navigate("/student/exam"),
    },
    {
      title: "Completed Exams",
      value: stats.completedExams,
      icon: CheckCircle,
      variant: "success",
      action: () => navigate("/student/results"),
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: Award,
      variant: "info",
      action: () => navigate("/student/results"),
    },
    {
      title: "Pending Queries",
      value: stats.pendingQueries,
      icon: Clock,
      variant: "warning",
      action: () => navigate("/student/queries"),
    },
  ]

  const quickActions = [
    {
      title: "Take Exam",
      description: "Start a new examination",
      icon: Play,
      variant: "primary",
      action: () => navigate("/student/exam"),
    },
    {
      title: "View Results",
      description: "Check your exam results",
      icon: Award,
      variant: "success",
      action: () => navigate("/student/results"),
    },
    {
      title: "My Queries",
      description: "View your questions",
      icon: BookOpen,
      variant: "info",
      action: () => navigate("/student/queries"),
    },
  ]

  if (loading) {
    return (
      <Container className="d-flex align-items-center justify-content-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Welcome Section */}
      <Card className="bg-primary text-white mb-4">
        <Card.Body className="py-4">
          <h1 className="h3 fw-bold mb-2">Welcome back, {user?.username}!</h1>
          <p className="mb-0 opacity-75">Ready to take your next exam? Check out what's available below.</p>
        </Card.Body>
      </Card>

      {/* Stats Grid */}
      <Row className="g-3 mb-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <Col xs={12} sm={6} lg={3} key={index}>
              <Card 
                className="h-100 border-0 shadow-sm"
                style={{ cursor: 'pointer' }}
                onClick={stat.action}
              >
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <Card.Text className="text-muted mb-1 small">{stat.title}</Card.Text>
                      <h3 className={`fw-bold text-${stat.variant} mb-0`}>{stat.value}</h3>
                    </div>
                    <div className={`bg-${stat.variant} rounded p-3`}>
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* Available Exams & Recent Results */}
      <Row className="g-4 mb-4">
        {/* Available Exams */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-0">Available Exams</h5>
                <BookOpen className="text-muted" size={20} />
              </div>
            </Card.Header>
            <Card.Body>
              {recentExams.length > 0 ? (
                <div className="d-grid gap-3">
                  {recentExams.map((exam) => (
                    <Card 
                      key={exam.id}
                      className="border cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate("/student/exam")}
                    >
                      <Card.Body className="py-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{exam.title}</h6>
                            <div className="d-flex align-items-center text-muted small mb-2">
                              <Clock size={16} className="me-1" />
                              {exam.durationMin || exam.duration} minutes • {exam.totalMarks} marks
                            </div>
                            <div className="d-flex align-items-center">
                              <Badge bg="success" className="me-2">Active</Badge>
                              <small className="text-muted">
                                Ends: {new Date(exam.endTime).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                          <Button size="sm" variant="primary" className="ms-2">
                            Start
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <BookOpen className="text-muted mb-3" size={48} />
                  <p className="text-muted mb-1">No exams available</p>
                  <small className="text-muted">Check back later for new exams</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Results */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-0">Recent Results</h5>
                <TrendingUp className="text-muted" size={20} />
              </div>
            </Card.Header>
            <Card.Body>
              {recentResults.length > 0 ? (
                <div className="d-grid gap-3">
                  {recentResults.map((result) => (
                    <Card key={result.id} className="border-0 bg-light">
                      <Card.Body className="py-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{result.examTitle}</h6>
                            <small className="text-muted">
                              Completed on {result.createdOn ? new Date(result.createdOn).toLocaleDateString() : 'N/A'}
                            </small>
                          </div>
                          <div className="text-end ms-2">
                            <h5 className={`mb-0 fw-bold ${
                              result.percentage >= 70 ? "text-success" : result.percentage >= 50 ? "text-warning" : "text-danger"
                            }`}>
                              {result.percentage !== undefined && result.percentage !== null ? result.percentage.toFixed(1) + '%' : 'N/A'}
                            </h5>
                            <small className="text-muted">
                              {result.totalScore !== undefined && result.totalMarks !== undefined ? `${result.totalScore}/${result.totalMarks}` : 'N/A'}
                            </small>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <Award className="text-muted mb-3" size={48} />
                  <p className="text-muted mb-1">No results yet</p>
                  <small className="text-muted">Take an exam to see your results here</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Quick Actions</h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              
              return (
                <Col md={4} key={index}>
                  <Card 
                    className="border h-100"
                    style={{ cursor: 'pointer' }}
                    onClick={action.action}
                  >
                    <Card.Body className="d-flex align-items-center">
                      <div className={`bg-${action.variant} bg-opacity-10 rounded p-3 me-3`}>
                        <Icon className={`text-${action.variant}`} size={32} />
                      </div>
                      <div>
                        <h6 className="mb-1">{action.title}</h6>
                        <small className="text-muted">{action.description}</small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </Card.Body>
      </Card>

      {/* Performance Overview */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Performance Overview</h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-4">
            <Col md={4} className="text-center">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                <BookOpen className="text-primary" size={32} />
              </div>
              <h3 className="fw-bold">{stats.completedExams}</h3>
              <small className="text-muted">Exams Completed</small>
            </Col>
            <Col md={4} className="text-center">
              <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                <Award className="text-success" size={32} />
              </div>
              <h3 className="fw-bold">{stats.averageScore}%</h3>
              <small className="text-muted">Average Score</small>
            </Col>
            <Col md={4} className="text-center">
              <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                <TrendingUp className="text-info" size={32} />
              </div>
              <h3 className="fw-bold">{stats.completedExams > 0 ? "Good" : "Start"}</h3>
              <small className="text-muted">Progress</small>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default StudentDashboard
