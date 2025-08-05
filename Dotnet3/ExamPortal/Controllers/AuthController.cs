using Microsoft.AspNetCore.Mvc;
using ExamPortal.DTOs;
using ExamPortal.Services.Interfaces;

namespace ExamPortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }
        
        /// <summary>
        /// Register a new user
        /// </summary>
        [HttpPost("signup")]
        public async Task<ActionResult<UserResponseDTO>> RegisterUser([FromBody] UserSignupDTO signupDTO)
        {
            var user = await _userService.RegisterUserAsync(signupDTO);
            return CreatedAtAction(nameof(RegisterUser), new { id = user.Id }, user);
        }
        
        /// <summary>
        /// Authenticate user and get JWT token
        /// </summary>
        [HttpPost("signin")]
        public async Task<ActionResult<AuthResponse>> AuthenticateUser([FromBody] UserSignInDTO signInDTO)
        {
            var authResponse = await _userService.AuthenticateUserAsync(signInDTO);
            return Ok(authResponse);
        }
    }
}
