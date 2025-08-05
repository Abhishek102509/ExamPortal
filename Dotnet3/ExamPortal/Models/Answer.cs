using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamPortal.Models
{
    public class Answer : BaseEntity
    {
        [Required]
        public long QuestionId { get; set; }
        
        [Required]
        public long UserId { get; set; }
        
        [Required]
        [MaxLength(1)]
        public string SelectedOption { get; set; } = string.Empty;
        
        // Navigation properties
        [ForeignKey("QuestionId")]
        public virtual Question Question { get; set; } = null!;
        
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}
