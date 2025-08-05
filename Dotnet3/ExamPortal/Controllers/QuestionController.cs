using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExamPortal.DTOs;
using ExamPortal.Services.Interfaces;

namespace ExamPortal.Controllers
{
    [ApiController]
    [Route("api/questions")]
    [Authorize]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionService _questionService;
        
        public QuestionController(IQuestionService questionService)
        {
            _questionService = questionService;
        }
        
        /// <summary>
        /// Add a new question (Teacher only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<QuestionResponseDTO>> AddQuestion([FromBody] QuestionDTO questionDTO)
        {
            var question = await _questionService.AddQuestionAsync(questionDTO);
            return CreatedAtAction(nameof(GetQuestionById), new { questionId = question.Id }, question);
        }
        
        /// <summary>
        /// Update a question (Teacher only)
        /// </summary>
        [HttpPut("{questionId}")]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<QuestionResponseDTO>> UpdateQuestion(long questionId, [FromBody] QuestionDTO questionDTO)
        {
            var question = await _questionService.UpdateQuestionAsync(questionId, questionDTO);
            return Ok(question);
        }
        
        /// <summary>
        /// Delete a question (Teacher only)
        /// </summary>
        [HttpDelete("{questionId}")]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<ApiResponse>> DeleteQuestion(long questionId)
        {
            await _questionService.DeleteQuestionAsync(questionId);
            return Ok(new ApiResponse("Question deleted successfully"));
        }
        
        /// <summary>
        /// Get question by ID (Teacher only)
        /// </summary>
        [HttpGet("{questionId}")]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<QuestionResponseDTO>> GetQuestionById(long questionId)
        {
            var question = await _questionService.GetQuestionByIdAsync(questionId);
            return Ok(question);
        }
        
        /// <summary>
        /// Get questions by exam ID
        /// </summary>
        [HttpGet("exam/{examId}")]
        [Authorize(Roles = "STUDENT,TEACHER")]
        public async Task<ActionResult<List<QuestionResponseDTO>>> GetQuestionsByExam(long examId)
        {
            var questions = await _questionService.GetQuestionsByExamAsync(examId);
            return Ok(questions);
        }
    }
}
