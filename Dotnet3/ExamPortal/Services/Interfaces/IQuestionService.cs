using ExamPortal.DTOs;

namespace ExamPortal.Services.Interfaces
{
    public interface IQuestionService
    {
        Task<QuestionResponseDTO> AddQuestionAsync(QuestionDTO questionDTO);
        Task<QuestionResponseDTO> UpdateQuestionAsync(long questionId, QuestionDTO questionDTO);
        Task DeleteQuestionAsync(long questionId);
        Task<QuestionResponseDTO> GetQuestionByIdAsync(long questionId);
        Task<List<QuestionResponseDTO>> GetQuestionsByExamAsync(long examId);
    }
}
