package com.examportal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examportal.dto.ApiResponse;
import com.examportal.dto.QuestionDTO;
import com.examportal.dto.QuestionResponseDTO;
import com.examportal.service.QuestionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/questions")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
@Tag(name = "Question Management", description = "Question management APIs")
@SecurityRequirement(name = "bearerAuth")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Add a new question (Teacher only)")
    public ResponseEntity<QuestionResponseDTO> addQuestion(@Valid @RequestBody QuestionDTO questionDTO) {
        QuestionResponseDTO question = questionService.addQuestion(questionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(question);
    }

    @PutMapping("/{questionId}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Update a question (Teacher only)")
    public ResponseEntity<QuestionResponseDTO> updateQuestion(@PathVariable Long questionId, @Valid @RequestBody QuestionDTO questionDTO) {
        QuestionResponseDTO question = questionService.updateQuestion(questionId, questionDTO);
        return ResponseEntity.ok(question);
    }

    @DeleteMapping("/{questionId}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Delete a question (Teacher only)")
    public ResponseEntity<ApiResponse> deleteQuestion(@PathVariable Long questionId) {
        questionService.deleteQuestion(questionId);
        return ResponseEntity.ok(new ApiResponse("Question deleted successfully"));
    }

    @GetMapping("/{questionId}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Get question by ID (Teacher only)")
    public ResponseEntity<QuestionResponseDTO> getQuestionById(@PathVariable Long questionId) {
        QuestionResponseDTO question = questionService.getQuestionById(questionId);
        return ResponseEntity.ok(question);
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER')")
    @Operation(summary = "Get questions by exam ID")
    public ResponseEntity<List<QuestionResponseDTO>> getQuestionsByExam(@PathVariable Long examId) {
        List<QuestionResponseDTO> questions = questionService.getQuestionsByExam(examId);
        return ResponseEntity.ok(questions);
    }
}
