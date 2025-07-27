package com.examportal.service;

import com.examportal.dto.UserResponseDTO;
import com.examportal.dto.UserSignInDTO;
import com.examportal.dto.UserSignupDTO;

public interface UserService {
    UserResponseDTO registerUser(UserSignupDTO signupDTO);
    String authenticateUser(UserSignInDTO signInDTO);
    UserResponseDTO getUserProfile(String username);
}
