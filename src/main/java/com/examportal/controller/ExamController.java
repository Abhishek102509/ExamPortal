package com.examportal.controller;

import java.security.Principal;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.examportal.dto.ApiResponse;
import com.examportal.dto.ExamDTO;
import com.examportal.dto.ExamResponseDTO;
import com.examportal.dto.ResultResponseDTO;
import com.examportal.dto.SubmitExamDTO;
import com.examportal.service.ExamService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/exams")

@Tag(name = "Exam Management", description = "Exam management APIs")
@SecurityRequirement(name = "bearerAuth")
public class ExamController {

    @Autowired
    private ExamService examService;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Create a new exam (Teacher only)")
    public ResponseEntity<ExamResponseDTO> createExam(@Valid @RequestBody ExamDTO examDTO) {
        ExamResponseDTO exam = examService.createExam(examDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(exam);
    }

    @PutMapping("/{examId}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Update an exam (Teacher only)")
    public ResponseEntity<ExamResponseDTO> updateExam(@PathVariable Long examId, @Valid @RequestBody ExamDTO examDTO) {
        ExamResponseDTO exam = examService.updateExam(examId, examDTO);
        return ResponseEntity.ok(exam);
    }

    @DeleteMapping("/{examId}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Delete an exam (Teacher only)")
    public ResponseEntity<ApiResponse> deleteExam(@PathVariable Long examId) {
        examService.deleteExam(examId);
        return ResponseEntity.ok(new ApiResponse("Exam deleted successfully"));
    }

    @GetMapping("/{examId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER')")
    @Operation(summary = "Get exam by ID")
    public ResponseEntity<ExamResponseDTO> getExamById(@PathVariable Long examId) {
        ExamResponseDTO exam = examService.getExamById(examId);
        return ResponseEntity.ok(exam);
    }

    @GetMapping
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Get all exams (Teacher only)")
    public ResponseEntity<List<ExamResponseDTO>> getAllExams() {
        List<ExamResponseDTO> exams = examService.getAllExams();
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/active")
    @Operation(summary = "Get active exams")
    public ResponseEntity<List<ExamResponseDTO>> getActiveExams() {
        List<ExamResponseDTO> exams = examService.getActiveExams();
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming exams")
    public ResponseEntity<List<ExamResponseDTO>> getUpcomingExams() {
        List<ExamResponseDTO> exams = examService.getUpcomingExams();
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/subject")
    @Operation(summary = "Get exams by subject")
    public ResponseEntity<List<ExamResponseDTO>> getExamsBySubject(@RequestParam String subject) {
        List<ExamResponseDTO> exams = examService.getExamsBySubject(subject);
        return ResponseEntity.ok(exams);
    }

    @PostMapping("/submit")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit exam answers (Student only)")
    public ResponseEntity<ResultResponseDTO> submitExam(Principal principal, @Valid @RequestBody SubmitExamDTO submitExamDTO) {
        ResultResponseDTO result = examService.submitExam(principal.getName(), submitExamDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/results/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get my exam results (Student only)")
    public ResponseEntity<List<ResultResponseDTO>> getMyResults(Principal principal) {
        List<ResultResponseDTO> results = examService.getResultsByUser(principal.getName());
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{examId}/results")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Get results for an exam (Teacher only)")
    public ResponseEntity<List<ResultResponseDTO>> getResultsByExam(@PathVariable Long examId) {
        List<ResultResponseDTO> results = examService.getResultsByExam(examId);
        return ResponseEntity.ok(results);
    }
}
