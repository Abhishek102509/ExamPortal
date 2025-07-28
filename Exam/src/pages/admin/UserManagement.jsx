import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Form, Modal, InputGroup } from "react-bootstrap"
import { userAPI } from "../../services/api"
import toast from "react-hot-toast"
import { Users, Search, Edit, Trash2, UserCheck, Mail, Calendar, Filter } from "lucide-react"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "STUDENT",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers()
      setUsers(response.data)
    } catch (error) {
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await userAPI.updateUser(editingUser.id, formData)
      toast.success("User updated successfully")
      fetchUsers()
      setShowModal(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to update user: " + (error?.response?.data?.message || error.message))
      console.error("Error updating user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userAPI.deleteUser(id)
        toast.success("User deleted successfully")
        fetchUsers()
      } catch (error) {
        toast.error("Failed to delete user: " + (error?.response?.data?.message || error.message))
        console.error("Error deleting user:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      role: "STUDENT",
    })
    setEditingUser(null)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "ALL" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const getRoleColor = (role) => {
    switch (role) {
      case "TEACHER":
        return "bg-purple-100 text-purple-800"
      case "STUDENT":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

if (loading && users.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '16rem' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  return (
    <Container className="py-5">
      {/* Header */}
      <div>
        <h1 className="display-4">User Management</h1>
        <p className="text-muted">Manage students and teachers</p>
      </div>

{/* Filters */}
      <Row className="my-4">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <InputGroup>
            <InputGroup.Text><Search /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col xs={12} md={6}>
          <InputGroup>
            <InputGroup.Text><Filter /></InputGroup.Text>
            <Form.Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="TEACHER">Teachers</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      {/* Stats */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small">Total Users</p>
                  <h3 className="mb-0">{users.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <Users className="text-primary" size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small">Students</p>
                  <h3 className="mb-0">
                    {users.filter((u) => u.role === "STUDENT").length}
                  </h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <UserCheck className="text-success" size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small">Teachers</p>
                  <h3 className="mb-0">
                    {users.filter((u) => u.role === "TEACHER").length}
                  </h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <UserCheck className="text-warning" size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Users Table */}
      <Card>
        <div className="table-responsive">
          <Table hover>
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Email</th>
                <th>Joined</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-gradient-primary rounded-circle p-2 me-3" style={{ background: 'linear-gradient(45deg, #007bff, #6f42c1)' }}>
                        <UserCheck className="text-white" size={16} />
                      </div>
                      <div>
                        <div className="fw-bold">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-muted small">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge 
                      bg={user.role === 'TEACHER' ? 'warning' : user.role === 'STUDENT' ? 'primary' : 'secondary'}
                      className="text-uppercase"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Mail className="me-2 text-muted" size={16} />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center text-muted">
                      <Calendar className="me-2" size={16} />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-5">
            <Users className="text-muted mb-3" size={48} />
            <p className="text-muted">No users found</p>
          </div>
        )}
      </Card>

      {/* Edit User Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false)
        resetForm()
      }} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2">
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
                variant="primary" 
                type="submit" 
                disabled={loading}
              >
                {loading ? "Updating..." : "Update User"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default UserManagement
