package com.examportal.service;

import java.util.List;

import com.examportal.dto.StudentQueryDTO;
import com.examportal.dto.StudentQueryResponseDTO;

public interface StudentQueryService {
    StudentQueryResponseDTO submitQuery(String username, StudentQueryDTO queryDTO);
    List<StudentQueryResponseDTO> getQueriesByUser(String username);
    List<StudentQueryResponseDTO> getAllQueries();
    void deleteQuery(Long queryId);
}
