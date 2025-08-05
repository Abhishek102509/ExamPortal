using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExamPortal.DTOs;
using ExamPortal.Services.Interfaces;
using System.Security.Claims;

namespace ExamPortal.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        
        /// <summary>
        /// Get current user profile
        /// </summary>
        [HttpGet("profile")]
        [Authorize(Roles = "STUDENT,TEACHER")]
        public async Task<ActionResult<UserResponseDTO>> GetUserProfile()
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username))
                return Unauthorized();
                
            var user = await _userService.GetUserProfileAsync(username);
            return Ok(user);
        }
        
        /// <summary>
        /// Get all users - TEACHER only
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<List<UserResponseDTO>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        
        /// <summary>
        /// Get user by ID - TEACHER only
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<UserResponseDTO>> GetUserById(long id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            return Ok(user);
        }
        
        /// <summary>
        /// Update user - TEACHER only
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult<UserResponseDTO>> UpdateUser(long id, [FromBody] UserUpdateDTO updateDTO)
        {
            var updatedUser = await _userService.UpdateUserAsync(id, updateDTO);
            return Ok(updatedUser);
        }
        
        /// <summary>
        /// Delete user - TEACHER only
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "TEACHER")]
        public async Task<ActionResult> DeleteUser(long id)
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
    }
}
