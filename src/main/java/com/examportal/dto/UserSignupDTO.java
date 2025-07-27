package com.examportal.dto;

import com.examportal.entities.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserSignupDTO {
    
    @NotBlank(message = "Username must be provided")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Email must be provided")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password must be provided")
    @Pattern(regexp = "((?=.*\\d)(?=.*[a-z])(?=.*[#@$*]).{5,20})", 
             message = "Password must contain at least one digit, one lowercase letter, one special character (#@$*), and be 5-20 characters long")
    private String password;
    
    @NotNull(message = "Role must be provided")
    private UserRole role;
}
