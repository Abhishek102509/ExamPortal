package com.examportal.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examportal.entities.Question;

public interface QuestionDao extends JpaRepository<Question, Long> {
    List<Question> findByExamId(Long examId);
    void deleteByExamId(Long examId);
}
