using System.ComponentModel.DataAnnotations;

namespace ExamPortal.Models
{
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        public UserRole Role { get; set; }
        
        // Navigation properties
        public virtual ICollection<StudentQuery> StudentQueries { get; set; } = new List<StudentQuery>();
        public virtual ICollection<Result> Results { get; set; } = new List<Result>();
    }
}
