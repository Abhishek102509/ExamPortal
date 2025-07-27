package com.examportal.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examportal.entities.Result;

public interface ResultDao extends JpaRepository<Result, Long> {
    List<Result> findByUserId(Long userId);
    List<Result> findByExamId(Long examId);
    Optional<Result> findByUserIdAndExamId(Long userId, Long examId);
}
