using ExamPortal.DTOs;

namespace ExamPortal.Services.Interfaces
{
    public interface IExamService
    {
        Task<ExamResponseDTO> CreateExamAsync(ExamDTO examDTO);
        Task<ExamResponseDTO> UpdateExamAsync(long examId, ExamDTO examDTO);
        Task DeleteExamAsync(long examId);
        Task<ExamResponseDTO> GetExamByIdAsync(long examId);
        Task<List<ExamResponseDTO>> GetAllExamsAsync();
        Task<List<ExamResponseDTO>> GetActiveExamsAsync();
        Task<List<ExamResponseDTO>> GetUpcomingExamsAsync();
        Task<List<ExamResponseDTO>> GetExamsBySubjectAsync(string subject);
        Task<ResultResponseDTO> SubmitExamAsync(string username, SubmitExamDTO submitExamDTO);
        Task<List<ResultResponseDTO>> GetResultsByUserAsync(string username);
        Task<List<ResultResponseDTO>> GetResultsByExamAsync(long examId);
    }
}
