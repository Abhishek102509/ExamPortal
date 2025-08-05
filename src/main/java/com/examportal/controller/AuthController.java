package com.examportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examportal.dto.AuthResponse;
import com.examportal.dto.OtpVerificationDTO;
import com.examportal.dto.ResendOtpDTO;
import com.examportal.dto.UserResponseDTO;
import com.examportal.dto.UserSignInDTO;
import com.examportal.dto.UserSignupDTO;
import com.examportal.service.OtpService;
import com.examportal.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private OtpService otpService;

@PostMapping("/signup")
    @Operation(summary = "Register a new user")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserSignupDTO signupDTO) {
        UserResponseDTO user = userService.registerUser(signupDTO);
        otpService.createOtp(signupDTO.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP")
    public ResponseEntity<String> verifyOtp(@Valid @RequestBody OtpVerificationDTO otpVerificationDTO) {
        otpService.verifyOtp(otpVerificationDTO.getEmail(), otpVerificationDTO.getOtp());
        return ResponseEntity.ok("OTP verified successfully!");
    }
    
    @PostMapping("/resend-otp")
    @Operation(summary = "Resend OTP")
    public ResponseEntity<String> resendOtp(@Valid @RequestBody ResendOtpDTO resendOtpDTO) {
        otpService.resendOtp(resendOtpDTO.getEmail());
        return ResponseEntity.ok("OTP resent successfully!");
    }

    @PostMapping("/signin")
    @Operation(summary = "Authenticate user and get JWT token")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody UserSignInDTO signInDTO) {
        AuthResponse authResponse = userService.authenticateUser(signInDTO);
        return ResponseEntity.ok(authResponse);
    }
}
