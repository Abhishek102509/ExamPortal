using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamPortal.Models
{
    public class Question : BaseEntity
    {
        [Required]
        public long ExamId { get; set; }
        
        [Required]
        public string QuestionText { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string OptionA { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string OptionB { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string OptionC { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string OptionD { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(1)]
        public string CorrectOption { get; set; } = string.Empty;
        
        [Required]
        public int Marks { get; set; }
        
        // Navigation properties
        [ForeignKey("ExamId")]
        public virtual Exam Exam { get; set; } = null!;
        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
}
