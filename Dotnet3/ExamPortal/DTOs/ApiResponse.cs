namespace ExamPortal.DTOs
{
    public class ApiResponse
    {
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; } = true;
        
        public ApiResponse(string message, bool success = true)
        {
            Message = message;
            Success = success;
        }
    }
}
