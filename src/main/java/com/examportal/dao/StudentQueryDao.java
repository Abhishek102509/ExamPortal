package com.examportal.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examportal.entities.StudentQuery;

public interface StudentQueryDao extends JpaRepository<StudentQuery, Long> {
    List<StudentQuery> findByUsername(String username);
}
