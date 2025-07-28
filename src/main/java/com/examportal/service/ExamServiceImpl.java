package com.examportal.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examportal.dao.AnswerDao;
import com.examportal.dao.ExamDao;
import com.examportal.dao.QuestionDao;
import com.examportal.dao.ResultDao;
import com.examportal.dao.UserDao;
import com.examportal.dto.AnswerDTO;
import com.examportal.dto.ExamDTO;
import com.examportal.dto.ExamResponseDTO;
import com.examportal.dto.QuestionResponseDTO;
import com.examportal.dto.ResultResponseDTO;
import com.examportal.dto.SubmitExamDTO;
import com.examportal.entities.Answer;
import com.examportal.entities.Exam;
import com.examportal.entities.Question;
import com.examportal.entities.Result;
import com.examportal.entities.User;
import com.examportal.exceptions.ApiException;
import com.examportal.exceptions.ResourceNotFoundException;

@Service
@Transactional
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamDao examDao;
    
    @Autowired
    private QuestionDao questionDao;
    
    @Autowired
    private AnswerDao answerDao;
    
    @Autowired
    private ResultDao resultDao;
    
    @Autowired
    private UserDao userDao;
    
    @Autowired
    private ModelMapper mapper;

    @Override
    public ExamResponseDTO createExam(ExamDTO examDTO) {
        if (examDTO.getStartTime().isAfter(examDTO.getEndTime())) {
            throw new ApiException("Start time cannot be after end time");
        }
        
        Exam exam = mapper.map(examDTO, Exam.class);
        Exam savedExam = examDao.save(exam);
        return mapToExamResponseDTO(savedExam);
    }

    @Override
    public ExamResponseDTO updateExam(Long examId, ExamDTO examDTO) {
        Exam exam = examDao.findById(examId)
            .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));
        
        if (examDTO.getStartTime().isAfter(examDTO.getEndTime())) {
            throw new ApiException("Start time cannot be after end time");
        }
        
        mapper.map(examDTO, exam);
        Exam updatedExam = examDao.save(exam);
        return mapToExamResponseDTO(updatedExam);
    }

    @Override
    public void deleteExam(Long examId) {
        if (!examDao.existsById(examId)) {
            throw new ResourceNotFoundException("Exam not found with id: " + examId);
        }
        examDao.deleteById(examId);
    }

    @Override
    @Transactional(readOnly = true)
    public ExamResponseDTO getExamById(Long examId) {
        Exam exam = examDao.findById(examId)
            .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));
        return mapToExamResponseDTO(exam);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamResponseDTO> getAllExams() {
        return examDao.findAll().stream()
            .map(this::mapToExamResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamResponseDTO> getActiveExams() {
        return examDao.findActiveExams(LocalDateTime.now()).stream()
            .map(this::mapToExamResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamResponseDTO> getUpcomingExams() {
        return examDao.findUpcomingExams(LocalDateTime.now()).stream()
            .map(this::mapToExamResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamResponseDTO> getExamsBySubject(String subject) {
        return examDao.findBySubject(subject).stream()
            .map(this::mapToExamResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    public ResultResponseDTO submitExam(String username, SubmitExamDTO submitExamDTO) {
        User user = userDao.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        Exam exam = examDao.findById(submitExamDTO.getExamId())
            .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + submitExamDTO.getExamId()));
        
        // Check if user has already submitted this exam
        if (answerDao.existsByUserIdAndExamId(user.getId(), exam.getId())) {
            throw new ApiException("You have already submitted this exam");
        }
        
        // Check if exam is active
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(exam.getStartTime()) || now.isAfter(exam.getEndTime())) {
            throw new ApiException("Exam is not currently active");
        }
        
        // Check if all questions are answered
        if (submitExamDTO.getAnswers().size() != exam.getQuestions().size()) {
            throw new ApiException("All questions must be answered before submitting the exam.");
        }
        
        int totalScore = 0;
        int totalPossibleMarks = 0;
        
        System.out.println("=== EXAM SUBMISSION DEBUG ===");
        System.out.println("User: " + username);
        System.out.println("Exam: " + exam.getTitle());
        System.out.println("Total answers: " + submitExamDTO.getAnswers().size());
        
        // Process each answer
        for (AnswerDTO answerDTO : submitExamDTO.getAnswers()) {
            Question question = questionDao.findById(answerDTO.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + answerDTO.getQuestionId()));
            
            boolean isCorrect = question.getCorrectOption().equals(answerDTO.getSelectedOption());
            int score = isCorrect ? question.getMarks() : 0;
            totalScore += score;
            totalPossibleMarks += question.getMarks();
            
            System.out.println("Question " + question.getId() + ":");
            System.out.println("  Text: " + question.getQuestionText());
            System.out.println("  Correct: " + question.getCorrectOption());
            System.out.println("  Selected: " + answerDTO.getSelectedOption());
            System.out.println("  IsCorrect: " + isCorrect);
            System.out.println("  Marks: " + question.getMarks());
            System.out.println("  Score: " + score);
            
            Answer answer = new Answer(user, exam, question, answerDTO.getSelectedOption(), isCorrect, score);
            answerDao.save(answer);
        }
        
        System.out.println("Total Score: " + totalScore);
        System.out.println("Total Possible Marks: " + totalPossibleMarks);
        
        // Calculate percentage and status using actual question marks
        double percentage = totalPossibleMarks > 0 ? (double) totalScore / totalPossibleMarks * 100 : 0;
        String status = percentage >= 50 ? "PASSED" : "FAILED";
        
        System.out.println("Percentage: " + percentage + "%");
        System.out.println("Status: " + status);
        
        // Save result
        Result result = new Result(user, exam, totalScore, status);
        Result savedResult = resultDao.save(result);
        
        return mapToResultResponseDTO(savedResult, percentage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResultResponseDTO> getResultsByUser(String username) {
        User user = userDao.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        return resultDao.findByUserId(user.getId()).stream()
            .map(result -> {
                // Calculate percentage based on actual question marks
                int totalPossibleMarks = result.getExam().getQuestions().stream()
                    .mapToInt(Question::getMarks)
                    .sum();
                double percentage = totalPossibleMarks > 0 ? (double) result.getTotalScore() / totalPossibleMarks * 100 : 0;
                return mapToResultResponseDTO(result, percentage);
            })
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResultResponseDTO> getResultsByExam(Long examId) {
        return resultDao.findByExamId(examId).stream()
            .map(result -> {
                // Calculate percentage based on actual question marks
                int totalPossibleMarks = result.getExam().getQuestions().stream()
                    .mapToInt(Question::getMarks)
                    .sum();
                double percentage = totalPossibleMarks > 0 ? (double) result.getTotalScore() / totalPossibleMarks * 100 : 0;
                return mapToResultResponseDTO(result, percentage);
            })
            .collect(Collectors.toList());
    }
    
    private ExamResponseDTO mapToExamResponseDTO(Exam exam) {
        ExamResponseDTO dto = mapper.map(exam, ExamResponseDTO.class);
        List<QuestionResponseDTO> questions = exam.getQuestions().stream()
            .map(question -> mapper.map(question, QuestionResponseDTO.class))
            .collect(Collectors.toList());
        dto.setQuestions(questions);
        return dto;
    }
    
    private ResultResponseDTO mapToResultResponseDTO(Result result, double percentage) {
        ResultResponseDTO dto = mapper.map(result, ResultResponseDTO.class);
        dto.setUsername(result.getUser().getUsername());
        dto.setExamTitle(result.getExam().getTitle());
        // Calculate total marks from actual questions
        int totalMarks = result.getExam().getQuestions().stream()
            .mapToInt(Question::getMarks)
            .sum();
        dto.setTotalMarks(totalMarks);
        dto.setPercentage(percentage);
        dto.setCreatedOn(result.getCreatedOn());
        return dto;
    }
}
