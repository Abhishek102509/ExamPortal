using ExamPortal.DTOs;

namespace ExamPortal.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDTO> RegisterUserAsync(UserSignupDTO signupDTO);
        Task<AuthResponse> AuthenticateUserAsync(UserSignInDTO signInDTO);
        Task<UserResponseDTO> GetUserProfileAsync(string username);
        Task<List<UserResponseDTO>> GetAllUsersAsync();
        Task<UserResponseDTO> GetUserByIdAsync(long id);
        Task<UserResponseDTO> UpdateUserAsync(long id, UserUpdateDTO updateDTO);
        Task DeleteUserAsync(long id);
    }
}
