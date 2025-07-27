package com.examportal.dto;

import com.examportal.entities.UserRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO extends BaseDTO {
    private String username;
    private String email;
    private UserRole role;
}
