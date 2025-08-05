namespace ExamPortal.DTOs
{
    public class StudentQueryResponseDTO
    {
        public long Id { get; set; }
        public long StudentId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Query { get; set; } = string.Empty;
        public string? Response { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? RespondedAt { get; set; }
    }
}
