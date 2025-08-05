using ExamPortal.DTOs;

namespace ExamPortal.Services.Interfaces
{
    public interface IStudentQueryService
    {
        Task<StudentQueryResponseDTO> SubmitQueryAsync(string username, StudentQueryDTO queryDTO);
        Task<List<StudentQueryResponseDTO>> GetQueriesByUserAsync(string username);
        Task<List<StudentQueryResponseDTO>> GetAllQueriesAsync();
        Task<StudentQueryResponseDTO> UpdateQueryAsync(long queryId, StudentQueryUpdateDTO updateDTO);
        Task DeleteQueryAsync(long queryId);
    }
}
