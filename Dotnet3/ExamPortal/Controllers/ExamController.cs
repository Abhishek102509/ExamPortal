using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExamPortal.DTOs;
using ExamPortal.Services.Interfaces;
using System.Security.Claims;

namespace ExamPortal.Controllers
{
    [ApiController]
    [Route("api/exams")]
    [Authorize]
    public class ExamController : ControllerBase
    {
        private readonly IExamService _examService;
        
        public ExamController(IExamService examService)
        {
            _examService = examService;
        }
        
        /// <summary>
        /// Create a new exam (Teacher only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<ExamResponseDTO>> CreateExam([FromBody] ExamDTO examDTO)
        {
            var exam = await _examService.CreateExamAsync(examDTO);
            return CreatedAtAction(nameof(GetExamById), new { examId = exam.Id }, exam);
        }
        
        /// <summary>
        /// Update an exam (Teacher only)
        /// </summary>
        [HttpPut("{examId}")]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<ExamResponseDTO>> UpdateExam(long examId, [FromBody] ExamDTO examDTO)
        {
            var exam = await _examService.UpdateExamAsync(examId, examDTO);
            return Ok(exam);
        }
        
        /// <summary>
        /// Delete an exam (Teacher only)
        /// </summary>
        [HttpDelete("{examId}")]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<ApiResponse>> DeleteExam(long examId)
        {
            await _examService.DeleteExamAsync(examId);
            return Ok(new ApiResponse("Exam deleted successfully"));
        }
        
        /// <summary>
        /// Get exam by ID
        /// </summary>
        [HttpGet("{examId}")]
        [Authorize(Roles = "STUDENT,TEACHER")]
        public async Task<ActionResult<ExamResponseDTO>> GetExamById(long examId)
        {
            var exam = await _examService.GetExamByIdAsync(examId);
            return Ok(exam);
        }
        
        /// <summary>
        /// Get all exams (Teacher only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<List<ExamResponseDTO>>> GetAllExams()
        {
            var exams = await _examService.GetAllExamsAsync();
            return Ok(exams);
        }
        
        /// <summary>
        /// Get active exams
        /// </summary>
        [HttpGet("active")]
        public async Task<ActionResult<List<ExamResponseDTO>>> GetActiveExams()
        {
            var exams = await _examService.GetActiveExamsAsync();
            return Ok(exams);
        }
        
        /// <summary>
        /// Get upcoming exams
        /// </summary>
        [HttpGet("upcoming")]
        public async Task<ActionResult<List<ExamResponseDTO>>> GetUpcomingExams()
        {
            var exams = await _examService.GetUpcomingExamsAsync();
            return Ok(exams);
        }
        
        /// <summary>
        /// Get exams by subject
        /// </summary>
        [HttpGet("subject")]
        public async Task<ActionResult<List<ExamResponseDTO>>> GetExamsBySubject([FromQuery] string subject)
        {
            var exams = await _examService.GetExamsBySubjectAsync(subject);
            return Ok(exams);
        }
        
        /// <summary>
        /// Submit exam answers (Student only)
        /// </summary>
        [HttpPost("submit")]
        [Authorize(Roles = "STUDENT")]
        public async Task<ActionResult<ResultResponseDTO>> SubmitExam([FromBody] SubmitExamDTO submitExamDTO)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username))
                return Unauthorized();
                
            var result = await _examService.SubmitExamAsync(username, submitExamDTO);
            return Ok(result);
        }
        
        /// <summary>
        /// Get my exam results (Student only)
        /// </summary>
        [HttpGet("results/my")]
        [Authorize(Roles = "STUDENT")]
        public async Task<ActionResult<List<ResultResponseDTO>>> GetMyResults()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username))
                return Unauthorized();
                
            var results = await _examService.GetResultsByUserAsync(username);
            return Ok(results);
        }
        
        /// <summary>
        /// Get results for an exam (Teacher only)
        /// </summary>
        [HttpGet("{examId}/results")]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<List<ResultResponseDTO>>> GetResultsByExam(long examId)
        {
            var results = await _examService.GetResultsByExamAsync(examId);
            return Ok(results);
        }
    }
}
