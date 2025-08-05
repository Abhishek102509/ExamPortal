using System.ComponentModel.DataAnnotations;

namespace ExamPortal.DTOs
{
    public class StudentQueryDTO
    {
        [Required(ErrorMessage = "Title must be provided")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Subject must be provided")]
        public string Subject { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Query must be provided")]
        public string Query { get; set; } = string.Empty;
    }
}
