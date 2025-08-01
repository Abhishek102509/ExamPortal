package com.examportal.dto;

import com.examportal.entities.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserUpdateDTO {
    
    @NotBlank(message = "Username must be provided")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Email must be provided")
    @Email(message = "Invalid email format")
    private String email;
    
    // Password is optional for updates - if null/empty, password won't be changed
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
    
    @NotBlank(message = "First name must be provided")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name must be provided")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    @NotNull(message = "Role must be provided")
    private UserRole role;
}
