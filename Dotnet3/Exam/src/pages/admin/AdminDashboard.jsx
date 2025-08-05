"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap'
import { examAPI, userAPI, queryAPI } from "../../services/api"
import { Users, FileText, CheckCircle, HelpCircle, Calendar, Award, Plus, TrendingUp, Clock } from "lucide-react"
import toast from "react-hot-toast"

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalResults: 0,
    pendingQueries: 0,
  })
  const [recentExams, setRecentExams] = useState([])
  const [recentQueries, setRecentQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log("Fetching dashboard data...")
      
      const [examsRes, queriesRes, usersRes] = await Promise.all([
        examAPI.getAllExams().then(res => {
          console.log("Exams data:", res.data)
          return res
        }).catch((error) => {
          console.error("Error fetching exams:", error)
          toast.error("Failed to load exams")
          return { data: [] }
        }),
        queryAPI.getAllQueries().then(res => {
          console.log("Queries data:", res.data)
          return res
        }).catch((error) => {
          console.error("Error fetching queries:", error)
          toast.error("Failed to load queries")
          return { data: [] }
        }),
        userAPI.getAllUsers().then(res => {
          console.log("Users data:", res.data)
          return res
        }).catch((error) => {
          console.error("Error fetching users:", error)
          toast.error("Failed to load users")
          return { data: [] }
        }),
      ])

      const now = new Date()
      const totalExams = examsRes.data?.length || 0
      const completedExams = examsRes.data?.filter(exam => {
        const endTime = new Date(exam.endTime)
        return now > endTime
      }).length || 0
      const pendingQueries = queriesRes.data?.filter(q => q.status === "PENDING")?.length || 0
      const totalStudents = usersRes.data?.filter(u => u.role === "STUDENT").length || 0

      console.log("Calculated stats:", {
        totalExams,
        completedExams,
        pendingQueries,
        totalStudents,
      })

      setStats({
        totalExams,
        completedExams,
        pendingQueries,
        totalStudents,
      })

      setRecentExams(examsRes.data?.slice(0, 5) || [])
      setRecentQueries(queriesRes.data?.slice(0, 5) || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      link: "/admin/users",
    },
    {
      title: "Total Exams",
      value: stats.totalExams,
      icon: FileText,
      link: "/admin/exams",
    },
    {
      title: "Completed Exams",
      value: stats.completedExams,
      icon: CheckCircle,
      link: "/admin/results",
    },
    {
      title: "Pending Queries",
      value: stats.pendingQueries,
      icon: HelpCircle,
      link: "/admin/queries",
    },
  ];

  const quickActions = [
    {
      title: "Create New Exam",
      description: "Set up a new examination",
      icon: Plus,
      action: () => navigate("/admin/exams"),
    },
    {
      title: "Manage Students",
      description: "View and manage students",
      icon: Users,
      action: () => navigate("/admin/users"),
    },
    {
      title: "View Results",
      description: "Check exam results",
      icon: Award,
      action: () => navigate("/admin/results"),
    },
  ];

  if (loading) {
    return (
      	<Container className="d-flex align-items-center justify-content-center vh-100">
        	<Spinner animation="border" variant="primary" />
      	</Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card className="text-white bg-primary mb-4">
            <Card.Body>
              <h1 className="display-4">Teacher Dashboard</h1>
              <p className="lead">Manage your exams, students, and track performance</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Col md={6} lg={3} key={index} className="mb-4">
              <Card onClick={() => navigate(stat.link)} style={{ cursor: 'pointer' }}>
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted">{stat.title}</div>
                    <h3>{stat.value}</h3>
                  </div>
                  <Icon size={24} />
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Row className="mb-4">
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Recent Exams</h5>
              <Calendar size={20} />
            </Card.Header>
            <Card.Body>
              {recentExams.length > 0 ? (
                <ul className="list-group">
                  {recentExams.map((exam) => {
                    const now = new Date();
                    const startTime = new Date(exam.startTime);
                    const endTime = new Date(exam.endTime);
                    const isActive = now >= startTime && now <= endTime;
                    const status = now < startTime ? "Upcoming" : (isActive ? "Active" : "Completed");
                    const badgeColor = now < startTime ? "info" : (isActive ? "success" : "secondary");
                    
                    return (
                      <li key={exam.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{exam.title}</span>
                        <Badge bg={badgeColor}>{status}</Badge>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-center text-muted">No exams created yet</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Recent Queries</h5>
              <HelpCircle size={20} />
            </Card.Header>
            <Card.Body>
              {recentQueries.length > 0 ? (
                <ul className="list-group">
                  {recentQueries.map((query) => (
                    <li key={query.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{query.title}</span>
                      <Badge bg={query.status === "PENDING" ? "warning" : "success"}>{query.status}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted">No queries yet</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Col md={4} className="mb-3" key={index}>
                      <Button variant="outline-primary" onClick={action.action} className="w-100">
                        <Icon size={20} className="me-2" />
                        {action.title}
                      </Button>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard
