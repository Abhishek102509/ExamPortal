package com.examportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserSignInDTO {
    
    @NotBlank(message = "Username must be provided")
    private String username;
    
    @NotBlank(message = "Password must be provided")
    private String password;
}
