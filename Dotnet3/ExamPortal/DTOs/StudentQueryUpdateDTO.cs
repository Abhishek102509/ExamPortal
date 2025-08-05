using System.ComponentModel.DataAnnotations;

namespace ExamPortal.DTOs
{
    public class StudentQueryUpdateDTO
    {
        [Required(ErrorMessage = "Response must be provided")]
        public string Response { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Status must be provided")]
        public string Status { get; set; } = string.Empty;
    }
}
