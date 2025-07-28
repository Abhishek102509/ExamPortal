import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import AdminDashboard from "./pages/admin/AdminDashboard"
import StudentDashboard from "./pages/student/StudentDashboard"
import ExamManagement from "./pages/admin/ExamManagement"
import QuestionManagement from "./pages/admin/QuestionManagement"
import UserManagement from "./pages/admin/UserManagement"
import AdminQueries from "./pages/admin/AdminQueries"
import AdminExamResults from "./pages/admin/ExamResults"
import TakeExam from "./pages/student/TakeExam"
import ExamResults from "./pages/student/ExamResults"
import StudentQueries from "./pages/student/StudentQueries"
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";

// Create a component that can access the auth context
function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="App min-vh-100 bg-light">
      {/* Only show main Navbar on public pages (when user is not logged in) */}
      {!user && <Navbar />}
      <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exams"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <Layout>
                    <ExamManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/questions"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <Layout>
                    <QuestionManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <Layout>
                    <UserManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/queries"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <Layout>
                    <AdminQueries />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exam/:examId/results"
              element={
                <ProtectedRoute requiredRole="TEACHER">
                  <Layout>
                    <AdminExamResults />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Protected student routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Layout>
                    <StudentDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/exam"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Layout>
                    <TakeExam />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/results"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Layout>
                    <ExamResults />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/queries"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Layout>
                    <StudentQueries />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App
