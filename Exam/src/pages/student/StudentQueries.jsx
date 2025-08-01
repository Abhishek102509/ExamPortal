

import { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Spinner,
  InputGroup,
  FormControl,
  Badge,
  Alert,
} from "react-bootstrap"
import { queryAPI } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import toast from "react-hot-toast"
import { Plus, MessageCircle, Clock, CheckCircle, AlertCircle, Send, Search } from "lucide-react"

const StudentQueries = () => {
  const { user } = useAuth()
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
  })

  useEffect(() => {
    fetchQueries()
  }, [])

  const fetchQueries = async () => {
    try {
      const response = await queryAPI.getMyQueries()
      setQueries(response.data)
    } catch (error) {
      console.error("Failed to fetch queries:", error)
      toast.error("Failed to fetch queries")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!user) {
      toast.error("User not loaded. Please log in again.")
      setLoading(false)
      return
    }

    try {
      const queryData = {
        ...formData,
      }

      await queryAPI.createQuery(queryData)
      toast.success("Query submitted successfully")
      fetchQueries()
      setShowModal(false)
      setFormData({ subject: "", description: "" })
    } catch (error) {
      console.error("Error submitting query:", error)
      toast.error(error.response?.data?.message || "Failed to submit query")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="me-1 text-warning" />
      case "RESOLVED":
        return <CheckCircle className="me-1 text-success" />
      default:
        return <AlertCircle className="me-1 text-secondary" />
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "warning"
      case "RESOLVED":
        return "success"
      default:
        return "secondary"
    }
  }

  const filteredQueries = queries.filter(
    (query) =>
      query.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading && queries.length === 0) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ height: '16rem' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>My Queries</h2>
          <p className="text-muted">Submit and track your questions</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus className="me-2" size={16} />
            New Query
          </Button>
        </Col>
      </Row>

      {/* Search */}
      <InputGroup className="mb-4">
        <InputGroup.Text><Search size={16} /></InputGroup.Text>
        <FormControl
          placeholder="Search queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* Query List */}
      {filteredQueries.length > 0 ? (
        filteredQueries.map((query) => (
          <Card className="mb-4" key={query.id}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="mb-2">{query.subject}</h5>
                  <Badge bg={getStatusVariant(query.status)} className="mb-3">
                    {getStatusIcon(query.status)}
                    {query.status}
                  </Badge>
                  <p>{query.description}</p>
                  <small className="text-muted">
                    Submitted on {new Date(query.createdAt || query.createdOn).toLocaleDateString()}
                  </small>
                </div>
              </div>

              {query.response && (
                <Alert variant="info" className="mt-4">
                  <div className="d-flex align-items-center mb-2">
                    <MessageCircle className="me-2 text-primary" size={18} />
                    <strong>Teacher Response</strong>
                  </div>
                  <p className="mb-1">{query.response}</p>
                  {query.respondedAt && (
                    <small className="text-muted">
                      Responded on {new Date(query.respondedAt).toLocaleDateString()}
                    </small>
                  )}
                </Alert>
              )}
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="text-center py-5">
          <MessageCircle size={48} className="text-muted mb-3" />
          <p className="text-muted">No queries found</p>
          <small className="text-muted">Submit your first query to get help from teachers.</small>
        </div>
      )}

      {/* Modal for submitting query */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit New Query</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Brief subject of your query"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe your question or issue in detail..."
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false)
                setFormData({ subject: "", description: "" })
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} className="me-2" />
                  Submit Query
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default StudentQueries
