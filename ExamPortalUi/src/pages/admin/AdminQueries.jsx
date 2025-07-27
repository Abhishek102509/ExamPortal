// "use client"

// import { useState, useEffect } from "react"
// import Layout from "../../components/Layout"
// import { queryAPI } from "../../services/api"
// import toast from "react-hot-toast"
// import { MessageSquare, Clock, User, CheckCircle } from "lucide-react"

// const AdminQueries = () => {
//   const [queries, setQueries] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [respondingTo, setRespondingTo] = useState(null)

//   useEffect(() => {
//     fetchQueries()
//   }, [])

//   const fetchQueries = async () => {
//     try {
//       const response = await queryAPI.getAllQueries()
//       setQueries(response.data)
//     } catch (error) {
//       console.error("Error fetching queries:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const ResponseModal = ({ query, onClose, onSave }) => {
//     const [response, setResponse] = useState(query?.response || "")

//     const handleSubmit = async (e) => {
//       e.preventDefault()
//       try {
//         await queryAPI.updateQuery(query.id, {
//           response,
//           status: "RESOLVED",
//         })
//         toast.success("Response sent successfully")
//         onSave()
//         onClose()
//       } catch (error) {
//         toast.error("Failed to send response")
//         console.error("Error updating query:", error)
//       }
//     }

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
//           <h2 className="text-lg font-semibold mb-4">Respond to Query</h2>

//           <div className="mb-4 p-4 bg-gray-50 rounded-lg">
//             <h3 className="font-medium text-gray-900 mb-2">{query.subject}</h3>
//             <p className="text-gray-600 text-sm">{query.description}</p>
//             <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
//               <User className="h-3 w-3" />
//               <span>
//                 {query.userFirstName} {query.userLastName}
//               </span>
//               <Clock className="h-3 w-3 ml-2" />
//               <span>{new Date(query.createdAt).toLocaleDateString()}</span>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Your Response</label>
//               <textarea
//                 required
//                 value={response}
//                 onChange={(e) => setResponse(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 rows="4"
//                 placeholder="Enter your response to the student"
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
//                 Send Response
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <Layout title="Student Queries">
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//         </div>
//       </Layout>
//     )
//   }

//   return (
//     <Layout title="Student Queries">
//       <div className="space-y-6">
//         {/* Header */}
//         <div>
//           <h2 className="text-lg font-semibold text-gray-900">Student Queries</h2>
//           <p className="text-sm text-gray-600">Manage and respond to student queries</p>
//         </div>

//         {/* Queries List */}
//         {queries.length > 0 ? (
//           <div className="space-y-4">
//             {queries.map((query) => (
//               <div key={query.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <h3 className="text-lg font-semibold text-gray-900">{query.subject}</h3>
//                       <span
//                         className={`px-2 py-1 text-xs rounded-full ${
//                           query.status === "RESOLVED"
//                             ? "bg-green-100 text-green-800"
//                             : query.status === "IN_PROGRESS"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {query.status.replace("_", " ")}
//                       </span>
//                     </div>

//                     <p className="text-gray-600 mb-3">{query.description}</p>

//                     <div className="flex items-center space-x-4 text-sm text-gray-500">
//                       <div className="flex items-center space-x-1">
//                         <User className="h-4 w-4" />
//                         <span>
//                           {query.userFirstName} {query.userLastName}
//                         </span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Clock className="h-4 w-4" />
//                         <span>Submitted: {new Date(query.createdAt).toLocaleDateString()}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {query.status !== "RESOLVED" && (
//                     <button
//                       onClick={() => setRespondingTo(query)}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
//                     >
//                       Respond
//                     </button>
//                   )}
//                 </div>

//                 {query.response && (
//                   <div className="mt-4 p-4 bg-green-50 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <CheckCircle className="h-4 w-4 text-green-600" />
//                       <span className="text-sm font-medium text-green-900">Your Response</span>
//                     </div>
//                     <p className="text-green-800 text-sm">{query.response}</p>
//                     {query.respondedAt && (
//                       <p className="text-green-600 text-xs mt-2">
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
//             <p className="text-gray-600">Student queries will appear here when submitted.</p>
//           </div>
//         )}

//         {/* Response Modal */}
//         {respondingTo && (
//           <ResponseModal query={respondingTo} onClose={() => setRespondingTo(null)} onSave={fetchQueries} />
//         )}
//       </div>
//     </Layout>
//   )
// }

// export default AdminQueries








"use client"

import { useState, useEffect } from "react"
import { queryAPI } from "../../services/api"
import toast from "react-hot-toast"
import { MessageCircle, Clock, CheckCircle, AlertCircle, Send, Search, Filter, User, Calendar } from "lucide-react"

const AdminQueries = () => {
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
    setLoading(true)

    try {
      const updateData = {
        ...selectedQuery,
        response: response,
        status: "RESOLVED",
        respondedAt: new Date().toISOString(),
      }

      await queryAPI.updateQuery(selectedQuery.id, updateData)
      toast.success("Response sent successfully")
      fetchQueries()
      setShowModal(false)
      setSelectedQuery(null)
      setResponse("")
    } catch (error) {
      toast.error("Failed to send response")
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

  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.studentName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "ALL" || query.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const pendingCount = queries.filter((q) => q.status === "PENDING").length
  const resolvedCount = queries.filter((q) => q.status === "RESOLVED").length

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Queries</h1>
        <p className="text-gray-600">Respond to student questions and concerns</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Queries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{queries.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{resolvedCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
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

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {query.studentName || "Unknown Student"}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(query.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{query.description}</p>

                {query.response && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-900">Your Response</span>
                    </div>
                    <p className="text-green-800">{query.response}</p>
                    {query.respondedAt && (
                      <p className="text-xs text-green-600 mt-2">
                        Responded on {new Date(query.respondedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="ml-4">
                <button
                  onClick={() => handleRespond(query)}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    query.status === "PENDING"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {query.status === "PENDING" ? "Respond" : "Edit Response"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQueries.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No queries found</p>
        </div>
      )}

      {/* Response Modal */}
      {showModal && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedQuery.status === "PENDING" ? "Respond to Query" : "Edit Response"}
            </h2>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedQuery.subject}</h3>
              <p className="text-gray-600 mb-2">{selectedQuery.description}</p>
              <p className="text-sm text-gray-500">
                From: {selectedQuery.studentName} • {new Date(selectedQuery.createdAt).toLocaleDateString()}
              </p>
            </div>

            <form onSubmit={handleSubmitResponse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                <textarea
                  required
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="6"
                  placeholder="Type your response to help the student..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setSelectedQuery(null)
                    setResponse("")
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
                  {loading ? "Sending..." : "Send Response"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminQueries
