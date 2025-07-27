package com.examportal.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examportal.dao.UserDao;
import com.examportal.dto.UserResponseDTO;
import com.examportal.dto.UserSignInDTO;
import com.examportal.dto.UserSignupDTO;
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
        
        User user = mapper.map(signupDTO, User.class);
        user.setPassword(passwordEncoder.encode(signupDTO.getPassword()));
        
        User savedUser = userDao.save(user);
        return mapper.map(savedUser, UserResponseDTO.class);
    }

    @Override
    public String authenticateUser(UserSignInDTO signInDTO) {
        Authentication authentication = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(signInDTO.getUsername(), signInDTO.getPassword())
        );
        
        return jwtUtils.generateJwtToken(authentication);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserProfile(String username) {
        User user = userDao.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        return mapper.map(user, UserResponseDTO.class);
    }
}
