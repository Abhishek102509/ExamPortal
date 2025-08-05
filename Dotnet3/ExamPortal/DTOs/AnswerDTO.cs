using System.ComponentModel.DataAnnotations;

namespace ExamPortal.DTOs
{
    public class AnswerDTO
    {
        [Required(ErrorMessage = "Question ID must be provided")]
        public long QuestionId { get; set; }
        
        [Required(ErrorMessage = "Selected option must be provided")]
        [RegularExpression("[ABCD]", ErrorMessage = "Selected option must be A, B, C, or D")]
        public string SelectedOption { get; set; } = string.Empty;
    }
}
