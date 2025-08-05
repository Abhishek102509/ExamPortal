package com.examportal.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "pending_users")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true)
public class PendingUser extends BaseEntity {
    
    @Column(length = 50, nullable = false)
    private String username;
    
    @Column(length = 100, nullable = false)
    private String email;
    
    @Column(length = 100, nullable = false)
    private String password;
    
    @Column(length = 50, nullable = false)
    private String firstName;
    
    @Column(length = 50, nullable = false)
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private UserRole role;
    
    @Column(nullable = false)
    private LocalDateTime expiryTime;

    public PendingUser(String username, String email, String password, String firstName, String lastName, UserRole role, LocalDateTime expiryTime) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.expiryTime = expiryTime;
    }
}
