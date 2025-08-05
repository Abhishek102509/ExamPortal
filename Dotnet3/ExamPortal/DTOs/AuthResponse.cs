namespace ExamPortal.DTOs
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string TokenType { get; set; } = "Bearer";
        public UserResponseDTO User { get; set; } = null!;
    }
}
