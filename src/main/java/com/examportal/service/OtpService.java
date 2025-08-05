package com.examportal.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examportal.dao.UserDao;
import com.examportal.entities.OtpEntity;
import com.examportal.entities.User;
import com.examportal.dao.OtpDao;
import com.examportal.exceptions.ApiException;

@Service
public class OtpService {

    @Autowired
    private OtpDao otpDao;

    @Autowired
    private UserDao userDao;
    
    @Autowired
    private EmailService emailService;

    private final Random random = new Random();

    private final int otpLength = 6;

    public String generateOtp() {
        int otp = random.nextInt((int) Math.pow(10, otpLength));
        return String.format("%06d", otp);
    }

public void createOtp(String email) {
        User user = userDao.findByEmail(email).orElseThrow(() -> new ApiException("User not found with email: " + email));
        
        // Delete any existing OTPs for this user
        Optional<OtpEntity> existingOtp = otpDao.findByUserEmail(email);
        if (existingOtp.isPresent()) {
            otpDao.delete(existingOtp.get());
        }
        
        String otp = generateOtp();
        System.out.println("Generated OTP: " + otp + " for email: " + email);
        
        OtpEntity otpEntity = new OtpEntity(user, otp, LocalDateTime.now().plusMinutes(10));
        otpDao.save(otpEntity);
        
        System.out.println("OTP saved to database for email: " + email);
        
        // Send email
        emailService.sendOtpEmail(email, otp, user.getFirstName());
    }

    public void resendOtp(String email) {
        User user = userDao.findByEmail(email).orElseThrow(() -> new ApiException("User not found with email: " + email));
        String otp = generateOtp();
        OtpEntity otpEntity = otpDao.findByUserEmail(email)
            .orElse(new OtpEntity(user, otp, LocalDateTime.now().plusMinutes(10)));
        otpEntity.setOtp(otp);
        otpEntity.setExpirationTime(LocalDateTime.now().plusMinutes(10));
        otpDao.save(otpEntity);
        emailService.sendOtpEmail(email, otp, user.getFirstName());
    }

    public void verifyOtp(String email, String otp) {
        System.out.println("Verifying OTP for email: " + email + ", OTP: " + otp);
        
        // Check if there's any OTP record for this email
        Optional<OtpEntity> anyOtpForUser = otpDao.findByUserEmail(email);
        if (anyOtpForUser.isPresent()) {
            OtpEntity existingOtp = anyOtpForUser.get();
            System.out.println("Found OTP record - Email: " + existingOtp.getUser().getEmail() + 
                             ", Stored OTP: " + existingOtp.getOtp() + 
                             ", Expiry: " + existingOtp.getExpirationTime());
        } else {
            System.out.println("No OTP record found for email: " + email);
        }
        
        OtpEntity otpEntity = otpDao.findByUserEmailAndOtp(email, otp)
                .orElseThrow(() -> new ApiException("OTP is invalid or expired"));
        
        if (otpEntity.getExpirationTime().isBefore(LocalDateTime.now())) {
            throw new ApiException("OTP is expired");
        }
        
        User user = otpEntity.getUser();
        user.setEmailVerified(true);
        userDao.save(user);
        otpDao.delete(otpEntity);
        
        System.out.println("OTP verified successfully for email: " + email);
    }
}
