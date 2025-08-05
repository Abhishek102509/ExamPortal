"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Badge, Modal, Form, InputGroup, Spinner } from 'react-bootstrap'
import { queryAPI } from "../../services/api"
import toast from "react-hot-toast"
import { MessageCircle, Clock, CheckCircle, AlertCircle, Send, Search, Filter, User, Calendar } from "lucide-react"

function AdminQueries() {
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [showModal, setShowModal] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [response, setResponse] = useState("")

  useEffect(() => {
    fetchQueries()
  }, [])

  const fetchQueries = async () => {
    try {
      const response = await queryAPI.getAllQueries()
      setQueries(response.data)
    } catch (error) {
      toast.error("Failed to fetch queries")
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = (query) => {
    setSelectedQuery(query)
    setResponse(query.response || "")
    setShowModal(true)
  }

  const handleSubmitResponse = async (e) => {
    e.preventDefault()
    if (!response.trim()) {
      toast.error("Please enter a response")
      return
    }
    
    try {
      await queryAPI.updateQuery(selectedQuery.id, {
        response: response.trim(),
        status: "RESOLVED",
      })
      toast.success("Response sent successfully")
      fetchQueries()
      setShowModal(false)
      setSelectedQuery(null)
      setResponse("")
    } catch (error) {
      console.error("Error sending response:", error)
      toast.error(error.response?.data?.message || "Failed to send response")
    }
  }

  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      query.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.query?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.username?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "ALL" || query.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const pendingCount = queries.filter((q) => q.status === "PENDING").length
  const resolvedCount = queries.filter((q) => q.status === "RESOLVED").length

  if (loading && queries.length === 0) {
    return (
      <Container className="d-flex align-items-center justify-content-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Student Queries</h1>
          <p className="text-muted">Respond to student questions and concerns</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Total Queries</div>
                <h3>{queries.length}</h3>
              </div>
              <MessageCircle size={24} className="text-primary" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Pending</div>
                <h3 className="text-warning">{pendingCount}</h3>
              </div>
              <Clock size={24} className="text-warning" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Resolved</div>
                <h3 className="text-success">{resolvedCount}</h3>
              </div>
              <CheckCircle size={24} className="text-success" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
          </Form.Select>
        </Col>  
      </Row>

      <Row>
        <Col>
          {filteredQueries.map((query) => (
            <Card key={query.id} className="mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <h5 className="me-3">{query.title}</h5>
                      <Badge bg="info" className="me-2">{query.subject}</Badge>
                      <Badge bg={query.status === "PENDING" ? "warning" : "success"}>
                        {query.status}
                      </Badge>
                    </div>
                    <div className="d-flex align-items-center text-muted small mb-2">
                      <User size={16} className="me-1" />
                      <span className="me-3">{query.username || "Unknown Student"}</span>
                      <Calendar size={16} className="me-1" />
                      <span>{new Date(query.createdOn || query.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-muted">{query.query}</p>
                  </div>
                  <Button
                    variant={query.status === "PENDING" ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => handleRespond(query)}
                  >
                    <Send size={16} className="me-1" />
                    {query.status === "PENDING" ? "Respond" : "Edit"}
                  </Button>
                </div>

                {query.response && (
                  <div className="mt-3 p-3 bg-light border-start border-success border-4">
                    <div className="d-flex align-items-center mb-2">
                      <CheckCircle size={16} className="text-success me-2" />
                      <strong className="text-success">Your Response</strong>
                    </div>
                    <p className="mb-1">{query.response}</p>
                    {query.respondedAt && (
                      <small className="text-success">
                        Responded on {new Date(query.respondedAt).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}

          {filteredQueries.length === 0 && (
            <Card>
              <Card.Body className="text-center py-5">
                <MessageCircle size={48} className="text-muted mb-3" />
                <p className="text-muted">No queries found</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedQuery?.status === "PENDING" ? "Respond to Query" : "Edit Response"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuery && (
            <>
              <Card className="mb-4">
                <Card.Body>
                  <h5>{selectedQuery.title}</h5>
                  <Badge bg="info" className="mb-2">{selectedQuery.subject}</Badge>
                  <p className="text-muted">{selectedQuery.query}</p>
                  <small className="text-muted">
                    From: {selectedQuery.username} • {new Date(selectedQuery.createdOn || selectedQuery.createdAt).toLocaleDateString()}
                  </small>
                </Card.Body>
              </Card>

              <Form onSubmit={handleSubmitResponse}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Response</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    required
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your response to help the student..."
                  />
                </Form.Group>
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowModal(false)
                      setSelectedQuery(null)
                      setResponse("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    <Send size={16} className="me-1" />
                    {loading ? "Sending..." : "Send Response"}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default AdminQueries
