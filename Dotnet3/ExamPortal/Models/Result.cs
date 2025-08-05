using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamPortal.Models
{
    public class Result : BaseEntity
    {
        [Required]
        public long ExamId { get; set; }
        
        [Required]
        public long UserId { get; set; }
        
        [Required]
        public int TotalMarks { get; set; }
        
        [Required]
        public int ObtainedMarks { get; set; }
        
        [Required]
        public DateTime SubmittedAt { get; set; }
        
        // Navigation properties
        [ForeignKey("ExamId")]
        public virtual Exam Exam { get; set; } = null!;
        
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}
