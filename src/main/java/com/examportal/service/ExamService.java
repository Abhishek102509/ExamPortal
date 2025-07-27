package com.examportal.service;

import java.util.List;

import com.examportal.dto.ExamDTO;
import com.examportal.dto.ExamResponseDTO;
import com.examportal.dto.ResultResponseDTO;
import com.examportal.dto.SubmitExamDTO;

public interface ExamService {
    ExamResponseDTO createExam(ExamDTO examDTO);
    ExamResponseDTO updateExam(Long examId, ExamDTO examDTO);
    void deleteExam(Long examId);
    ExamResponseDTO getExamById(Long examId);
    List<ExamResponseDTO> getAllExams();
    List<ExamResponseDTO> getActiveExams();
    List<ExamResponseDTO> getUpcomingExams();
    List<ExamResponseDTO> getExamsBySubject(String subject);
    ResultResponseDTO submitExam(String username, SubmitExamDTO submitExamDTO);
    List<ResultResponseDTO> getResultsByUser(String username);
    List<ResultResponseDTO> getResultsByExam(Long examId);
}
