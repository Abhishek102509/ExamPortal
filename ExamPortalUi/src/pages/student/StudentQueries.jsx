// "use client"

// import { useState, useEffect } from "react"
// import Layout from "../../components/Layout"
// import { queryAPI } from "../../services/api"
// import { useAuth } from "../../contexts/AuthContext"
// import toast from "react-hot-toast"
// import { Plus, MessageSquare, Clock, CheckCircle } from "lucide-react"

// const StudentQueries = () => {
//   const { user } = useAuth()
//   const [queries, setQueries] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showCreateModal, setShowCreateModal] = useState(false)

//   useEffect(() => {
//     fetchQueries()
//   }, [])

//   const fetchQueries = async () => {
//     try {
//       const response = await queryAPI.getUserQueries(user.id)
//       setQueries(response.data)
//     } catch (error) {
//       console.error("Error fetching queries:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const CreateQueryModal = ({ onClose, onSave }) => {
//     const [formData, setFormData] = useState({
//       subject: "",
//       description: "",
//     })

//     const handleSubmit = async (e) => {
//       e.preventDefault()
//       try {
//         await queryAPI.createQuery({
//           ...formData,
//           userId: user.id,
//         })
//         toast.success("Query submitted successfully")
//         onSave()
//         onClose()
//       } catch (error) {
//         toast.error("Failed to submit query")
//         console.error("Error creating query:", error)
//       }
//     }

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 w-full max-w-md">
//           <h2 className="text-lg font-semibold mb-4">Submit New Query</h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
//               <input
//                 type="text"
//                 required
//                 value={formData.subject}
//                 onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter query subject"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 required
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 rows="4"
//                 placeholder="Describe your query in detail"
//               />
//             </div>

//             <div className="flex justify-end space-x-3 pt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
//               >
//                 Submit Query
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <Layout title="My Queries">
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//         </div>
//       </Layout>
//     )
//   }

//   return (
//     <Layout title="My Queries">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">My Queries</h2>
//             <p className="text-sm text-gray-600">Submit and track your queries</p>
//           </div>
//           <button
//             onClick={() => setShowCreateModal(true)}
//             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <Plus className="h-4 w-4" />
//             <span>New Query</span>
//           </button>
//         </div>

//         {/* Queries List */}
//         {queries.length > 0 ? (
//           <div className="space-y-4">
//             {queries.map((query) => (
//               <div key={query.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">{query.subject}</h3>
//                     <p className="text-gray-600 mb-3">{query.description}</p>
//                     <div className="flex items-center space-x-4 text-sm text-gray-500">
//                       <div className="flex items-center space-x-1">
//                         <Clock className="h-4 w-4" />
//                         <span>Submitted: {new Date(query.createdAt).toLocaleDateString()}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <span
//                     className={`px-3 py-1 text-xs rounded-full ${
//                       query.status === "RESOLVED"
//                         ? "bg-green-100 text-green-800"
//                         : query.status === "IN_PROGRESS"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {query.status.replace("_", " ")}
//                   </span>
//                 </div>

//                 {query.response && (
//                   <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <CheckCircle className="h-4 w-4 text-blue-600" />
//                       <span className="text-sm font-medium text-blue-900">Admin Response</span>
//                     </div>
//                     <p className="text-blue-800 text-sm">{query.response}</p>
//                     {query.respondedAt && (
//                       <p className="text-blue-600 text-xs mt-2">
//                         Responded on: {new Date(query.respondedAt).toLocaleDateString()}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No queries yet</h3>
//             <p className="text-gray-600 mb-4">Submit your first query to get help from administrators.</p>
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Submit Query
//             </button>
//           </div>
//         )}

//         {/* Create Query Modal */}
//         {showCreateModal && <CreateQueryModal onClose={() => setShowCreateModal(false)} onSave={fetchQueries} />}
//       </div>
//     </Layout>
//   )
// }

// export default StudentQueries








"use client"

import { useState, useEffect } from "react"
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
      const response = await queryAPI.getQueriesByStudent(user.id)
      setQueries(response.data)
    } catch (error) {
      console.error("Failed to fetch queries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const queryData = {
        ...formData,
        studentId: user.id,
        status: "PENDING",
      }

      await queryAPI.createQuery(queryData)
      toast.success("Query submitted successfully")
      fetchQueries()
      setShowModal(false)
      setFormData({ subject: "", description: "" })
    } catch (error) {
      toast.error("Failed to submit query")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "RESOLVED":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredQueries = queries.filter(
    (query) =>
      query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading && queries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Queries</h1>
          <p className="text-gray-600">Submit and track your questions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Query
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Queries List */}
      <div className="space-y-4">
        {filteredQueries.map((query) => (
          <div key={query.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">{query.subject}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getStatusColor(query.status)}`}
                  >
                    {getStatusIcon(query.status)}
                    <span className="ml-1">{query.status}</span>
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{query.description}</p>
                <p className="text-sm text-gray-500">Submitted on {new Date(query.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {query.response && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-center mb-2">
                  <MessageCircle className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-900">Teacher Response</span>
                </div>
                <p className="text-blue-800">{query.response}</p>
                {query.respondedAt && (
                  <p className="text-xs text-blue-600 mt-2">
                    Responded on {new Date(query.respondedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredQueries.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No queries found</p>
          <p className="text-sm text-gray-400 mt-1">Submit your first query to get help from teachers</p>
        </div>
      )}

      {/* New Query Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submit New Query</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief subject of your query"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Describe your question or issue in detail..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormData({ subject: "", description: "" })
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? "Submitting..." : "Submit Query"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentQueries
