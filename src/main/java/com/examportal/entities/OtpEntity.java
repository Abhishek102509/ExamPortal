package com.examportal.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "otp_records")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true)
public class OtpEntity extends BaseEntity {
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(length = 6, nullable = false)
    private String otp;
    
    @Column(nullable = false)
    private LocalDateTime expirationTime;

    public OtpEntity(User user, String otp, LocalDateTime expirationTime) {
        this.user = user;
        this.otp = otp;
        this.expirationTime = expirationTime;
    }
}
