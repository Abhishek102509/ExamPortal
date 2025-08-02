package com.examportal.service;

import java.util.List;

import com.examportal.dto.StudentQueryDTO;
import com.examportal.dto.StudentQueryResponseDTO;
import com.examportal.dto.StudentQueryUpdateDTO;

public interface StudentQueryService {
    StudentQueryResponseDTO submitQuery(String username, StudentQueryDTO queryDTO);
    List<StudentQueryResponseDTO> getQueriesByUser(String username);
    List<StudentQueryResponseDTO> getAllQueries();
    StudentQueryResponseDTO updateQuery(Long queryId, StudentQueryUpdateDTO updateDTO);
    void deleteQuery(Long queryId);
}
