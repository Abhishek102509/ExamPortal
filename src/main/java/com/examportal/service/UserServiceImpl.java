package com.examportal.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import com.examportal.dao.UserDao;
import com.examportal.dto.AuthResponse;
import com.examportal.dto.UserResponseDTO;
import com.examportal.dto.UserSignInDTO;
import com.examportal.dto.UserSignupDTO;
import com.examportal.dto.UserUpdateDTO;
import com.examportal.entities.User;
import com.examportal.exceptions.ApiException;
import com.examportal.exceptions.ResourceNotFoundException;
import com.examportal.security.JwtUtils;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;
    
    @Autowired
    private ModelMapper mapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authManager;
    
    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public UserResponseDTO registerUser(UserSignupDTO signupDTO) {
        if (userDao.existsByUsername(signupDTO.getUsername())) {
            throw new ApiException("Username already exists!");
        }
        if (userDao.existsByEmail(signupDTO.getEmail())) {
            throw new ApiException("Email already exists!");
        }
        
        // Create user manually instead of using mapper to avoid mapping issues
        User user = new User(
            signupDTO.getUsername(),
            signupDTO.getEmail(),
            passwordEncoder.encode(signupDTO.getPassword()),
            signupDTO.getFirstName(),
            signupDTO.getLastName(),
            signupDTO.getRole()
        );
        
        // Explicitly set boolean fields to ensure they have values
        user.setEnabled(true);
        user.setEmailVerified(false);
        
        User savedUser = userDao.save(user);
        return mapper.map(savedUser, UserResponseDTO.class);
    }

    @Override
    public AuthResponse authenticateUser(UserSignInDTO signInDTO) {
        Authentication authentication = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(signInDTO.getEmailOrUsername(), signInDTO.getPassword())
        );
        
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        // Get the authenticated user
        User user = (User) authentication.getPrincipal();
        UserResponseDTO userResponseDTO = mapper.map(user, UserResponseDTO.class);
        
        return new AuthResponse(jwt, "User signed in successfully", userResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserProfile(String username) {
        User user = userDao.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        return mapper.map(user, UserResponseDTO.class);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userDao.findAll();
        return users.stream()
                .map(user -> mapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userDao.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        return mapper.map(user, UserResponseDTO.class);
    }
    
    @Override
    public UserResponseDTO updateUser(Long id, UserUpdateDTO updateDTO) {
        User existingUser = userDao.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Check if username is being changed and if it already exists
        if (!existingUser.getUsername().equals(updateDTO.getUsername()) && 
            userDao.existsByUsername(updateDTO.getUsername())) {
            throw new ApiException("Username already exists!");
        }
        
        // Check if email is being changed and if it already exists
        if (!existingUser.getEmail().equals(updateDTO.getEmail()) && 
            userDao.existsByEmail(updateDTO.getEmail())) {
            throw new ApiException("Email already exists!");
        }
        
        // Update user fields
        existingUser.setUsername(updateDTO.getUsername());
        existingUser.setEmail(updateDTO.getEmail());
        existingUser.setFirstName(updateDTO.getFirstName());
        existingUser.setLastName(updateDTO.getLastName());
        existingUser.setRole(updateDTO.getRole());
        
        // Update password only if provided
        if (updateDTO.getPassword() != null && !updateDTO.getPassword().trim().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updateDTO.getPassword()));
        }
        
        User updatedUser = userDao.save(existingUser);
        return mapper.map(updatedUser, UserResponseDTO.class);
    }
    
    @Override
    public void deleteUser(Long id) {
        User user = userDao.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        userDao.delete(user);
    }
}
