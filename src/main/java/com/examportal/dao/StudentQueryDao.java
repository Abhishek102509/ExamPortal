package com.examportal.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examportal.entities.StudentQuery;
import com.examportal.entities.User;

public interface StudentQueryDao extends JpaRepository<StudentQuery, Long> {
    List<StudentQuery> findByStudent(User student);
    List<StudentQuery> findByStudentUsername(String username);
}
