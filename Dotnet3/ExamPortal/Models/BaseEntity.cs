using System.ComponentModel.DataAnnotations;

namespace ExamPortal.Models
{
    public abstract class BaseEntity
    {
        [Key]
        public long Id { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
