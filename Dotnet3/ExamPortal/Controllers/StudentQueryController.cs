using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExamPortal.DTOs;
using ExamPortal.Services.Interfaces;
using System.Security.Claims;

namespace ExamPortal.Controllers
{
    [ApiController]
    [Route("api/queries")]
    [Authorize]
    public class StudentQueryController : ControllerBase
    {
        private readonly IStudentQueryService _studentQueryService;
        
        public StudentQueryController(IStudentQueryService studentQueryService)
        {
            _studentQueryService = studentQueryService;
        }
        
        /// <summary>
        /// Submit a new query (Student only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "STUDENT")]
        public async Task<ActionResult<StudentQueryResponseDTO>> SubmitQuery([FromBody] StudentQueryDTO queryDTO)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username))
                return Unauthorized();
                
            var query = await _studentQueryService.SubmitQueryAsync(username, queryDTO);
            return CreatedAtAction(nameof(SubmitQuery), new { id = query.Id }, query);
        }
        
        /// <summary>
        /// Get my queries (Student only)
        /// </summary>
        [HttpGet("my")]
        [Authorize(Roles = "STUDENT")]
        public async Task<ActionResult<List<StudentQueryResponseDTO>>> GetMyQueries()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username))
                return Unauthorized();
                
            var queries = await _studentQueryService.GetQueriesByUserAsync(username);
            return Ok(queries);
        }
        
        /// <summary>
        /// Get all queries (Teacher only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<List<StudentQueryResponseDTO>>> GetAllQueries()
        {
            var queries = await _studentQueryService.GetAllQueriesAsync();
            return Ok(queries);
        }
        
        /// <summary>
        /// Update a query with response (Teacher only)
        /// </summary>
        [HttpPut("{queryId}")]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<StudentQueryResponseDTO>> UpdateQuery(long queryId, [FromBody] StudentQueryUpdateDTO updateDTO)
        {
            var updatedQuery = await _studentQueryService.UpdateQueryAsync(queryId, updateDTO);
            return Ok(updatedQuery);
        }
        
        /// <summary>
        /// Delete a query (Teacher only)
        /// </summary>
        [HttpDelete("{queryId}")]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<ApiResponse>> DeleteQuery(long queryId)
        {
            await _studentQueryService.DeleteQueryAsync(queryId);
            return Ok(new ApiResponse("Query deleted successfully"));
        }
    }
}
