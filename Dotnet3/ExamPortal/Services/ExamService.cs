using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ExamPortal.Data;
using ExamPortal.DTOs;
using ExamPortal.Models;
using ExamPortal.Services.Interfaces;

namespace ExamPortal.Services
{
    public class ExamService : IExamService
    {
        private readonly ExamPortalDbContext _context;
        private readonly IMapper _mapper;
        
        public ExamService(ExamPortalDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        public async Task<ExamResponseDTO> CreateExamAsync(ExamDTO examDTO)
        {
            var exam = _mapper.Map<Exam>(examDTO);
            
            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();
            
            var response = _mapper.Map<ExamResponseDTO>(exam);
            response.QuestionCount = 0;
            
            return response;
        }
        
        public async Task<ExamResponseDTO> UpdateExamAsync(long examId, ExamDTO examDTO)
        {
            var exam = await _context.Exams.FindAsync(examId);
            
            if (exam == null)
            {
                throw new KeyNotFoundException("Exam not found");
            }
            
            _mapper.Map(examDTO, exam);
            exam.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            var response = _mapper.Map<ExamResponseDTO>(exam);
            response.QuestionCount = await _context.Questions.CountAsync(q => q.ExamId == examId);
            
            return response;
        }
        
        public async Task DeleteExamAsync(long examId)
        {
            var exam = await _context.Exams.FindAsync(examId);
            
            if (exam == null)
            {
                throw new KeyNotFoundException("Exam not found");
            }
            
            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();
        }
        
        public async Task<ExamResponseDTO> GetExamByIdAsync(long examId)
        {
            var exam = await _context.Exams.FindAsync(examId);
            
            if (exam == null)
            {
                throw new KeyNotFoundException("Exam not found");
            }
            
            var response = _mapper.Map<ExamResponseDTO>(exam);
            response.QuestionCount = await _context.Questions.CountAsync(q => q.ExamId == examId);
            
            return response;
        }
        
        public async Task<List<ExamResponseDTO>> GetAllExamsAsync()
        {
            var exams = await _context.Exams.ToListAsync();
            var responses = _mapper.Map<List<ExamResponseDTO>>(exams);
            
            foreach (var response in responses)
            {
                response.QuestionCount = await _context.Questions.CountAsync(q => q.ExamId == response.Id);
            }
            
            return responses;
        }
        
        public async Task<List<ExamResponseDTO>> GetActiveExamsAsync()
        {
            // Temporarily show all exams for testing
            var exams = await _context.Exams
                .ToListAsync();
                
            var responses = _mapper.Map<List<ExamResponseDTO>>(exams);
            
            foreach (var response in responses)
            {
                response.QuestionCount = await _context.Questions.CountAsync(q => q.ExamId == response.Id);
            }
            
            return responses;
        }
        
        public async Task<List<ExamResponseDTO>> GetUpcomingExamsAsync()
        {
            var now = DateTime.UtcNow;
            var exams = await _context.Exams
                .Where(e => e.StartTime > now)
                .ToListAsync();
                
            var responses = _mapper.Map<List<ExamResponseDTO>>(exams);
            
            foreach (var response in responses)
            {
                response.QuestionCount = await _context.Questions.CountAsync(q => q.ExamId == response.Id);
            }
            
            return responses;
        }
        
        public async Task<List<ExamResponseDTO>> GetExamsBySubjectAsync(string subject)
        {
            var exams = await _context.Exams
                .Where(e => e.Subject.ToLower().Contains(subject.ToLower()))
                .ToListAsync();
                
            var responses = _mapper.Map<List<ExamResponseDTO>>(exams);
            
            foreach (var response in responses)
            {
                response.QuestionCount = await _context.Questions.CountAsync(q => q.ExamId == response.Id);
            }
            
            return responses;
        }
        
        public async Task<ResultResponseDTO> SubmitExamAsync(string username, SubmitExamDTO submitExamDTO)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }
            
            var exam = await _context.Exams
                .Include(e => e.Questions)
                .FirstOrDefaultAsync(e => e.Id == submitExamDTO.ExamId);
                
            if (exam == null)
            {
                throw new KeyNotFoundException("Exam not found");
            }
            
            // Temporarily disable time validation for testing
            // var now = DateTime.UtcNow;
            // if (now < exam.StartTime || now > exam.EndTime)
            // {
            //     throw new InvalidOperationException("Exam is not active");
            // }
            
            // Check if user has already submitted
            var existingResult = await _context.Results
                .FirstOrDefaultAsync(r => r.ExamId == submitExamDTO.ExamId && r.UserId == user.Id);
                
            if (existingResult != null)
            {
                throw new InvalidOperationException("Exam already submitted");
            }
            
            // Calculate score
            int obtainedMarks = 0;
            
            foreach (var answerDto in submitExamDTO.Answers)
            {
                var question = exam.Questions.FirstOrDefault(q => q.Id == answerDto.QuestionId);
                if (question != null && question.CorrectOption == answerDto.SelectedOption)
                {
                    obtainedMarks += question.Marks;
                }
                
                // Save answer
                var answer = new Answer
                {
                    QuestionId = answerDto.QuestionId,
                    UserId = user.Id,
                    SelectedOption = answerDto.SelectedOption
                };
                
                _context.Answers.Add(answer);
            }
            
            // Save result
            var result = new Result
            {
                ExamId = submitExamDTO.ExamId,
                UserId = user.Id,
                TotalMarks = exam.TotalMarks,
                ObtainedMarks = obtainedMarks,
                SubmittedAt = DateTime.UtcNow
            };
            
            _context.Results.Add(result);
            await _context.SaveChangesAsync();
            
            var percentage = (double)obtainedMarks / exam.TotalMarks * 100;
            
            return new ResultResponseDTO
            {
                Id = result.Id,
                ExamId = exam.Id,
                ExamTitle = exam.Title,
                ExamSubject = exam.Subject,
                UserId = user.Id,
                Username = user.Username,
                TotalMarks = exam.TotalMarks,
                ObtainedMarks = obtainedMarks,
                Percentage = percentage,
                Status = percentage >= 50 ? "PASSED" : "FAILED",
                SubmittedAt = result.SubmittedAt
            };
        }
        
        public async Task<List<ResultResponseDTO>> GetResultsByUserAsync(string username)
        {
            var results = await _context.Results
                .Include(r => r.Exam)
                .Include(r => r.User)
                .Where(r => r.User.Username == username)
                .ToListAsync();
                
            return results.Select(r => {
                var percentage = (double)r.ObtainedMarks / r.TotalMarks * 100;
                return new ResultResponseDTO
                {
                    Id = r.Id,
                    ExamId = r.ExamId,
                    ExamTitle = r.Exam.Title,
                    ExamSubject = r.Exam.Subject,
                    UserId = r.UserId,
                    Username = r.User.Username,
                    TotalMarks = r.TotalMarks,
                    ObtainedMarks = r.ObtainedMarks,
                    Percentage = percentage,
                    Status = percentage >= 50 ? "PASSED" : "FAILED",
                    SubmittedAt = r.SubmittedAt
                };
            }).ToList();
        }
        
        public async Task<List<ResultResponseDTO>> GetResultsByExamAsync(long examId)
        {
            var results = await _context.Results
                .Include(r => r.Exam)
                .Include(r => r.User)
                .Where(r => r.ExamId == examId)
                .ToListAsync();
                
            return results.Select(r => {
                var percentage = (double)r.ObtainedMarks / r.TotalMarks * 100;
                return new ResultResponseDTO
                {
                    Id = r.Id,
                    ExamId = r.ExamId,
                    ExamTitle = r.Exam.Title,
                    ExamSubject = r.Exam.Subject,
                    UserId = r.UserId,
                    Username = r.User.Username,
                    TotalMarks = r.TotalMarks,
                    ObtainedMarks = r.ObtainedMarks,
                    Percentage = percentage,
                    Status = percentage >= 50 ? "PASSED" : "FAILED",
                    SubmittedAt = r.SubmittedAt
                };
            }).ToList();
        }
    }
}
