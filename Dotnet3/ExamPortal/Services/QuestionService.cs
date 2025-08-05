using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ExamPortal.Data;
using ExamPortal.DTOs;
using ExamPortal.Models;
using ExamPortal.Services.Interfaces;

namespace ExamPortal.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly ExamPortalDbContext _context;
        private readonly IMapper _mapper;
        
        public QuestionService(ExamPortalDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        public async Task<QuestionResponseDTO> AddQuestionAsync(QuestionDTO questionDTO)
        {
            var exam = await _context.Exams.FindAsync(questionDTO.ExamId);
            if (exam == null)
            {
                throw new KeyNotFoundException("Exam not found");
            }
            
            var question = _mapper.Map<Question>(questionDTO);
            
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            
            return _mapper.Map<QuestionResponseDTO>(question);
        }
        
        public async Task<QuestionResponseDTO> UpdateQuestionAsync(long questionId, QuestionDTO questionDTO)
        {
            var question = await _context.Questions.FindAsync(questionId);
            
            if (question == null)
            {
                throw new KeyNotFoundException("Question not found");
            }
            
            _mapper.Map(questionDTO, question);
            question.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            return _mapper.Map<QuestionResponseDTO>(question);
        }
        
        public async Task DeleteQuestionAsync(long questionId)
        {
            var question = await _context.Questions.FindAsync(questionId);
            
            if (question == null)
            {
                throw new KeyNotFoundException("Question not found");
            }
            
            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
        }
        
        public async Task<QuestionResponseDTO> GetQuestionByIdAsync(long questionId)
        {
            var question = await _context.Questions.FindAsync(questionId);
            
            if (question == null)
            {
                throw new KeyNotFoundException("Question not found");
            }
            
            return _mapper.Map<QuestionResponseDTO>(question);
        }
        
        public async Task<List<QuestionResponseDTO>> GetQuestionsByExamAsync(long examId)
        {
            var questions = await _context.Questions
                .Where(q => q.ExamId == examId)
                .ToListAsync();
                
            return _mapper.Map<List<QuestionResponseDTO>>(questions);
        }
    }
}
