using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ExamPortal.Data;
using ExamPortal.DTOs;
using ExamPortal.Models;
using ExamPortal.Services.Interfaces;

namespace ExamPortal.Services
{
    public class StudentQueryService : IStudentQueryService
    {
        private readonly ExamPortalDbContext _context;
        private readonly IMapper _mapper;
        
        public StudentQueryService(ExamPortalDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        public async Task<StudentQueryResponseDTO> SubmitQueryAsync(string username, StudentQueryDTO queryDTO)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }
            
            var studentQuery = new StudentQuery
            {
                StudentId = user.Id,
                Username = user.Username,
                Title = queryDTO.Title,
                Subject = queryDTO.Subject,
                Query = queryDTO.Query,
                Status = "PENDING"
            };
            
            _context.StudentQueries.Add(studentQuery);
            await _context.SaveChangesAsync();
            
            return _mapper.Map<StudentQueryResponseDTO>(studentQuery);
        }
        
        public async Task<List<StudentQueryResponseDTO>> GetQueriesByUserAsync(string username)
        {
            var queries = await _context.StudentQueries
                .Where(q => q.Username == username)
                .ToListAsync();
                
            return _mapper.Map<List<StudentQueryResponseDTO>>(queries);
        }
        
        public async Task<List<StudentQueryResponseDTO>> GetAllQueriesAsync()
        {
            var queries = await _context.StudentQueries.ToListAsync();
            return _mapper.Map<List<StudentQueryResponseDTO>>(queries);
        }
        
        public async Task<StudentQueryResponseDTO> UpdateQueryAsync(long queryId, StudentQueryUpdateDTO updateDTO)
        {
            var query = await _context.StudentQueries.FindAsync(queryId);
            
            if (query == null)
            {
                throw new KeyNotFoundException("Query not found");
            }
            
            query.Response = updateDTO.Response;
            query.Status = updateDTO.Status;
            query.RespondedAt = DateTime.UtcNow;
            query.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            return _mapper.Map<StudentQueryResponseDTO>(query);
        }
        
        public async Task DeleteQueryAsync(long queryId)
        {
            var query = await _context.StudentQueries.FindAsync(queryId);
            
            if (query == null)
            {
                throw new KeyNotFoundException("Query not found");
            }
            
            _context.StudentQueries.Remove(query);
            await _context.SaveChangesAsync();
        }
    }
}
