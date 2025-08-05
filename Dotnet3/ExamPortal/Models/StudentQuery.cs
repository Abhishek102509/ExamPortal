using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamPortal.Models
{
    public class StudentQuery : BaseEntity
    {
        [Required]
        public long StudentId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Subject { get; set; } = string.Empty;
        
        [Required]
        public string Query { get; set; } = string.Empty;
        
        public string? Response { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "PENDING";
        
        public DateTime? RespondedAt { get; set; }
        
        // Navigation properties
        [ForeignKey("StudentId")]
        public virtual User Student { get; set; } = null!;
    }
}
