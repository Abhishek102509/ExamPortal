using System.ComponentModel.DataAnnotations;

namespace ExamPortal.Models
{
    public class Exam : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Subject { get; set; } = string.Empty;
        
        [Required]
        public int TotalMarks { get; set; }
        
        [Required]
        public int DurationMin { get; set; }
        
        [Required]
        public DateTime StartTime { get; set; }
        
        [Required]
        public DateTime EndTime { get; set; }
        
        // Navigation properties
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
        public virtual ICollection<Result> Results { get; set; } = new List<Result>();
    }
}
