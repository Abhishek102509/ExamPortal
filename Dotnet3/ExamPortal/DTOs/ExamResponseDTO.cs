namespace ExamPortal.DTOs
{
    public class ExamResponseDTO
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public int TotalMarks { get; set; }
        public int DurationMin { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int QuestionCount { get; set; }
    }
}
