package com.examportal.dao;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.examportal.entities.Exam;

public interface ExamDao extends JpaRepository<Exam, Long> {
    List<Exam> findBySubject(String subject);
    
    @Query("SELECT e FROM Exam e WHERE e.startTime <= :now AND e.endTime >= :now")
    List<Exam> findActiveExams(LocalDateTime now);
    
    @Query("SELECT e FROM Exam e WHERE e.startTime > :now")
    List<Exam> findUpcomingExams(LocalDateTime now);
}
