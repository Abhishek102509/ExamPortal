using System.ComponentModel.DataAnnotations;

namespace ExamPortal.DTOs
{
    public class QuestionDTO
    {
        [Required(ErrorMessage = "Exam ID must be provided")]
        public long ExamId { get; set; }
        
        [Required(ErrorMessage = "Question text must be provided")]
        public string QuestionText { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Option A must be provided")]
        public string OptionA { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Option B must be provided")]
        public string OptionB { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Option C must be provided")]
        public string OptionC { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Option D must be provided")]
        public string OptionD { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Correct option must be provided")]
        [RegularExpression("[ABCD]", ErrorMessage = "Correct option must be A, B, C, or D")]
        public string CorrectOption { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Marks must be provided")]
        [Range(1, int.MaxValue, ErrorMessage = "Marks must be positive")]
        public int Marks { get; set; }
    }
}
