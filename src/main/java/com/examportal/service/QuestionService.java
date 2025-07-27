package com.examportal.service;

import java.util.List;

import com.examportal.dto.QuestionDTO;
import com.examportal.dto.QuestionResponseDTO;

public interface QuestionService {
    QuestionResponseDTO addQuestion(QuestionDTO questionDTO);
    QuestionResponseDTO updateQuestion(Long questionId, QuestionDTO questionDTO);
    void deleteQuestion(Long questionId);
    QuestionResponseDTO getQuestionById(Long questionId);
    List<QuestionResponseDTO> getQuestionsByExam(Long examId);
}
