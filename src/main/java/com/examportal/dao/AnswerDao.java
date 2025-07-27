package com.examportal.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examportal.entities.Answer;

public interface AnswerDao extends JpaRepository<Answer, Long> {
    List<Answer> findByUserIdAndExamId(Long userId, Long examId);
    List<Answer> findByExamId(Long examId);
    boolean existsByUserIdAndExamId(Long userId, Long examId);
}
