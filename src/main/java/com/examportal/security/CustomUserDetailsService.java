package com.examportal.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examportal.dao.UserDao;
import com.examportal.entities.User;

@Service
@Transactional
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String emailOrUsername) throws UsernameNotFoundException {
        User user = null;
        
        // Check if the input is an email (contains @)
        if (emailOrUsername.contains("@")) {
            user = userDao.findByEmail(emailOrUsername)
                .orElse(null);
        }
        
        // If not found by email or input doesn't contain @, try username
        if (user == null) {
            user = userDao.findByUsername(emailOrUsername)
                .orElse(null);
        }
        
        // If still not found, throw exception
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email or username: " + emailOrUsername);
        }
        
        return user;
    }
}
