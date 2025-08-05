using System.ComponentModel.DataAnnotations;

namespace ExamPortal.DTOs
{
    public class UserSignInDTO
    {
        [Required(ErrorMessage = "Email or Username must be provided")]
        public string EmailOrUsername { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Password must be provided")]
        public string Password { get; set; } = string.Empty;
    }
}
