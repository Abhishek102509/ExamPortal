package com.examportal.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examportal.dao.ExamDao;
import com.examportal.dao.QuestionDao;
import com.examportal.dto.QuestionDTO;
import com.examportal.dto.QuestionResponseDTO;
import com.examportal.entities.Exam;
import com.examportal.entities.Question;
import com.examportal.exceptions.ResourceNotFoundException;

@Service
@Transactional
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionDao questionDao;
    
    @Autowired
    private ExamDao examDao;
    
    @Autowired
    private ModelMapper mapper;

    @Override
    public QuestionResponseDTO addQuestion(QuestionDTO questionDTO) {
        Exam exam = examDao.findById(questionDTO.getExamId())
            .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + questionDTO.getExamId()));
        
        Question question = mapper.map(questionDTO, Question.class);
        question.setExam(exam);
        
        Question savedQuestion = questionDao.save(question);
        return mapToQuestionResponseDTO(savedQuestion);
    }

    @Override
    public QuestionResponseDTO updateQuestion(Long questionId, QuestionDTO questionDTO) {
        Question question = questionDao.findById(questionId)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
        
        Exam exam = examDao.findById(questionDTO.getExamId())
            .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + questionDTO.getExamId()));
        
        mapper.map(questionDTO, question);
        question.setExam(exam);
        
        Question updatedQuestion = questionDao.save(question);
        return mapToQuestionResponseDTO(updatedQuestion);
    }

    @Override
    public void deleteQuestion(Long questionId) {
        if (!questionDao.existsById(questionId)) {
            throw new ResourceNotFoundException("Question not found with id: " + questionId);
        }
        questionDao.deleteById(questionId);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionResponseDTO getQuestionById(Long questionId) {
        Question question = questionDao.findById(questionId)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
        return mapToQuestionResponseDTO(question);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionResponseDTO> getQuestionsByExam(Long examId) {
        return questionDao.findByExamId(examId).stream()
            .map(this::mapToQuestionResponseDTO)
            .collect(Collectors.toList());
    }
    
    private QuestionResponseDTO mapToQuestionResponseDTO(Question question) {
        QuestionResponseDTO dto = mapper.map(question, QuestionResponseDTO.class);
        dto.setExamId(question.getExam().getId());
        return dto;
    }
}
