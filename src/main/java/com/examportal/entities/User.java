package com.examportal.entities;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true)
public class User extends BaseEntity implements UserDetails {
    
    @Column(length = 50, unique = true, nullable = false)
    private String username;
    
    @Column(length = 50, unique = true, nullable = false)
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
    
    @Column(name = "is_enabled", nullable = false)
    private boolean enabled = true;
    
    @Column(name = "is_email_verified", nullable = false)
    private boolean emailVerified = false;

    public User(String username, String email, String password, String firstName, String lastName, UserRole role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.enabled = true;
        this.emailVerified = false;
    }
    
    @PrePersist
    public void prePersist() {
        if (this.enabled == false && this.enabled != true) {
            this.enabled = true;
        }
        // emailVerified should default to false, but ensure it's set
        // (it will be false by default due to field initialization)
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }

    @Override
    public String getUsername() {
        return this.username;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}
