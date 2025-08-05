using ExamPortal.Models;
using System.ComponentModel.DataAnnotations;

namespace ExamPortal.DTOs
{
    public class UserUpdateDTO
    {
        [Required(ErrorMessage = "Username must be provided")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        public string Username { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email must be provided")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;
        
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long")]
        public string? Password { get; set; }
        
        [Required(ErrorMessage = "First name must be provided")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 50 characters")]
        public string FirstName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Last name must be provided")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 50 characters")]
        public string LastName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Role must be provided")]
        public UserRole Role { get; set; }
    }
}
