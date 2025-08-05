package com.examportal.dao;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.examportal.entities.OtpEntity;

@Repository
public interface OtpDao extends JpaRepository<OtpEntity, Long> {
    
    @Query("SELECT o FROM OtpEntity o WHERE o.user.email = :email AND o.otp = :otp")
    Optional<OtpEntity> findByUserEmailAndOtp(@Param("email") String email, @Param("otp") String otp);
    
    @Query("SELECT o FROM OtpEntity o WHERE o.user.email = :email")
    Optional<OtpEntity> findByUserEmail(@Param("email") String email);
    
    @Modifying
    @Query("DELETE FROM OtpEntity o WHERE o.expirationTime < :currentTime")
    void deleteExpiredOtps(@Param("currentTime") LocalDateTime currentTime);
}
