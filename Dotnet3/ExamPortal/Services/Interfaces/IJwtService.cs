using ExamPortal.Models;

namespace ExamPortal.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
