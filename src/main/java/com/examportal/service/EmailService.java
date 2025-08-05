package com.examportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.examportal.exceptions.ApiException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("ExamPortal - Verify Your Email Address");
            
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Thank you for registering with ExamPortal!\n\n" +
                "To complete your registration, please verify your email address using the OTP below:\n\n" +
                "OTP: %s\n\n" +
                "This OTP will expire in 10 minutes for security reasons.\n\n" +
                "If you didn't create an account with ExamPortal, please ignore this email.\n\n" +
                "Best regards,\n" +
                "ExamPortal Team",
                userName, otp
            );
            
            message.setText(emailBody);
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new ApiException("Failed to send OTP email: " + e.getMessage());
        }
    }
}
