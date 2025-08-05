using System.ComponentModel.DataAnnotations;

namespace ExamPortal.DTOs
{
    public class ExamDTO
    {
        [Required(ErrorMessage = "Title must be provided")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Subject must be provided")]
        public string Subject { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Total marks must be provided")]
        [Range(1, int.MaxValue, ErrorMessage = "Total marks must be positive")]
        public int TotalMarks { get; set; }
        
        [Required(ErrorMessage = "Duration must be provided")]
        [Range(1, int.MaxValue, ErrorMessage = "Duration must be positive")]
        public int DurationMin { get; set; }
        
        [Required(ErrorMessage = "Start time must be provided")]
        public DateTime StartTime { get; set; }
        
        [Required(ErrorMessage = "End time must be provided")]
        public DateTime EndTime { get; set; }
    }
}
