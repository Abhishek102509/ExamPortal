namespace ExamPortal.DTOs
{
    public class ResultResponseDTO
    {
        public long Id { get; set; }
        public long ExamId { get; set; }
        public string ExamTitle { get; set; } = string.Empty;
        public string ExamSubject { get; set; } = string.Empty;
        public long UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public int TotalMarks { get; set; }
        public int ObtainedMarks { get; set; }
        public double Percentage { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
    }
}
