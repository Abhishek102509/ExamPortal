using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ExamPortal.Data;
using ExamPortal.DTOs;
using ExamPortal.Models;
using ExamPortal.Services.Interfaces;
using BCrypt.Net;

namespace ExamPortal.Services
{
    public class UserService : IUserService
    {
        private readonly ExamPortalDbContext _context;
        private readonly IMapper _mapper;
        private readonly IJwtService _jwtService;
        
        public UserService(ExamPortalDbContext context, IMapper mapper, IJwtService jwtService)
        {
            _context = context;
            _mapper = mapper;
            _jwtService = jwtService;
        }
        
        public async Task<UserResponseDTO> RegisterUserAsync(UserSignupDTO signupDTO)
        {
            // Check if username or email already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == signupDTO.Username || u.Email == signupDTO.Email);
                
            if (existingUser != null)
            {
                throw new InvalidOperationException("Username or email already exists");
            }
            
            var user = _mapper.Map<User>(signupDTO);
            user.Password = BCrypt.Net.BCrypt.HashPassword(signupDTO.Password);
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            return _mapper.Map<UserResponseDTO>(user);
        }
        
        public async Task<AuthResponse> AuthenticateUserAsync(UserSignInDTO signInDTO)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == signInDTO.EmailOrUsername || u.Email == signInDTO.EmailOrUsername);
                
            if (user == null || !BCrypt.Net.BCrypt.Verify(signInDTO.Password, user.Password))
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }
            
            var token = _jwtService.GenerateToken(user);
            var userResponse = _mapper.Map<UserResponseDTO>(user);
            
            return new AuthResponse
            {
                Token = token,
                User = userResponse
            };
        }
        
        public async Task<UserResponseDTO> GetUserProfileAsync(string username)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);
                
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }
            
            return _mapper.Map<UserResponseDTO>(user);
        }
        
        public async Task<List<UserResponseDTO>> GetAllUsersAsync()
        {
            var users = await _context.Users.ToListAsync();
            return _mapper.Map<List<UserResponseDTO>>(users);
        }
        
        public async Task<UserResponseDTO> GetUserByIdAsync(long id)
        {
            var user = await _context.Users.FindAsync(id);
            
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }
            
            return _mapper.Map<UserResponseDTO>(user);
        }
        
        public async Task<UserResponseDTO> UpdateUserAsync(long id, UserUpdateDTO updateDTO)
        {
            var user = await _context.Users.FindAsync(id);
            
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }
            
            // Check if username or email already exists for other users
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Id != id && (u.Username == updateDTO.Username || u.Email == updateDTO.Email));
                
            if (existingUser != null)
            {
                throw new InvalidOperationException("Username or email already exists");
            }
            
            _mapper.Map(updateDTO, user);
            
            if (!string.IsNullOrEmpty(updateDTO.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(updateDTO.Password);
            }
            
            user.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            return _mapper.Map<UserResponseDTO>(user);
        }
        
        public async Task DeleteUserAsync(long id)
        {
            var user = await _context.Users.FindAsync(id);
            
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }
            
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
