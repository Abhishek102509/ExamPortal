"use client"

import React, { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap'
import { useAuth } from "../../contexts/AuthContext"
import { resultAPI } from "../../services/api"
import { toast } from "react-hot-toast"
import { FileText, Clock, CheckCircle, XCircle, Award, TrendingUp } from "lucide-react"

function ExamResults() {
  const { user } = useAuth()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await resultAPI.getMyResults()
      console.log("=== EXAM RESULTS DEBUG ===")
      console.log("Results response:", response.data)
      setResults(response.data || [])
    } catch (error) {
      console.error("Error fetching results:", error)
      toast.error("Failed to fetch results")
    } finally {
      setLoading(false)
    }
  }

  const getStatusVariant = (status) => {
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
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "FAILED":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ height: '16rem' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h1 className="display-6 fw-bold text-dark">My Exam Results</h1>
        <p className="text-muted">View your exam performance and scores</p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-5">
          <FileText className="mx-auto mb-3" size={48} color="#6c757d" />
          <p className="text-muted">No exam results found</p>
          <p className="text-muted small mt-2">Complete some exams to see your results here</p>
        </div>
      ) : (
        <Row className="g-4">
          {results.map((result) => (
            <Col key={result.id} xs={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="flex-grow-1">
                      <Card.Title className="h5 fw-semibold mb-2">{result.examTitle}</Card.Title>
                      <div className="d-flex align-items-center gap-3 text-muted small">
                        <span>Score: {result.totalScore}/{result.totalMarks}</span>
                        <span>Percentage: {result.percentage?.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {getStatusIcon(result.status)}
                      <Badge bg={getStatusVariant(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                  </div>

                  <Row className="g-3">
                    <Col md={4}>
                      <div className="d-flex align-items-center gap-3 p-3 bg-primary bg-opacity-10 rounded">
                        <Award size={20} className="text-primary" />
                        <div>
                          <p className="small fw-medium text-primary mb-0">Total Score</p>
                          <p className="h5 fw-bold text-primary mb-0">{result.totalScore}</p>
                        </div>
                      </div>
                    </Col>

                    <Col md={4}>
                      <div className="d-flex align-items-center gap-3 p-3 bg-success bg-opacity-10 rounded">
                        <TrendingUp size={20} className="text-success" />
                        <div>
                          <p className="small fw-medium text-success mb-0">Percentage</p>
                          <p className="h5 fw-bold text-success mb-0">{result.percentage?.toFixed(1)}%</p>
                        </div>
                      </div>
                    </Col>

                    <Col md={4}>
                      <div className="d-flex align-items-center gap-3 p-3 bg-info bg-opacity-10 rounded">
                        <FileText size={20} className="text-info" />
                        <div>
                          <p className="small fw-medium text-info mb-0">Total Marks</p>
                          <p className="h5 fw-bold text-info mb-0">{result.totalMarks}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {result.submittedAt && (
                    <div className="mt-3 pt-3 border-top">
                      <p className="small text-muted mb-0">
                        Submitted on: {new Date(result.submittedAt).toLocaleDateString()} at{" "}
                        {new Date(result.submittedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default ExamResults
