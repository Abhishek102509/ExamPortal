package com.examportal.dao;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.examportal.entities.PendingUser;

@Repository
public interface PendingUserDao extends JpaRepository<PendingUser, Long> {
    
    Optional<PendingUser> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    @Modifying
    @Query("DELETE FROM PendingUser p WHERE p.expiryTime < :currentTime")
    void deleteExpiredPendingUsers(@Param("currentTime") LocalDateTime currentTime);
}
