package com.examportal.service;

import java.util.List;

import com.examportal.dto.AuthResponse;
import com.examportal.dto.UserResponseDTO;
import com.examportal.dto.UserSignInDTO;
import com.examportal.dto.UserSignupDTO;
import com.examportal.dto.UserUpdateDTO;

public interface UserService {
    UserResponseDTO registerUser(UserSignupDTO signupDTO);
    AuthResponse authenticateUser(UserSignInDTO signInDTO);
    UserResponseDTO getUserProfile(String username);
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO getUserById(Long id);
    UserResponseDTO updateUser(Long id, UserUpdateDTO updateDTO);
    void deleteUser(Long id);
}
