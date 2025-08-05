using System.ComponentModel.DataAnnotations;

namespace ExamPortal.DTOs
{
    public class SubmitExamDTO
    {
        [Required(ErrorMessage = "Exam ID must be provided")]
        public long ExamId { get; set; }
        
        [Required(ErrorMessage = "Answers must be provided")]
        public List<AnswerDTO> Answers { get; set; } = new List<AnswerDTO>();
    }
}
