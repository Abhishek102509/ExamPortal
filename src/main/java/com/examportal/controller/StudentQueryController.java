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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examportal.dto.ApiResponse;
import com.examportal.dto.StudentQueryDTO;
import com.examportal.dto.StudentQueryResponseDTO;
import com.examportal.service.StudentQueryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/queries")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
@Tag(name = "Student Query Management", description = "Student query management APIs")
@SecurityRequirement(name = "bearerAuth")
public class StudentQueryController {

    @Autowired
    private StudentQueryService studentQueryService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit a new query (Student only)")
    public ResponseEntity<StudentQueryResponseDTO> submitQuery(Principal principal, @Valid @RequestBody StudentQueryDTO queryDTO) {
        StudentQueryResponseDTO query = studentQueryService.submitQuery(principal.getName(), queryDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(query);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get my queries (Student only)")
    public ResponseEntity<List<StudentQueryResponseDTO>> getMyQueries(Principal principal) {
        List<StudentQueryResponseDTO> queries = studentQueryService.getQueriesByUser(principal.getName());
        return ResponseEntity.ok(queries);
    }

    @GetMapping
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Get all queries (Teacher only)")
    public ResponseEntity<List<StudentQueryResponseDTO>> getAllQueries() {
        List<StudentQueryResponseDTO> queries = studentQueryService.getAllQueries();
        return ResponseEntity.ok(queries);
    }

    @DeleteMapping("/{queryId}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Delete a query (Teacher only)")
    public ResponseEntity<ApiResponse> deleteQuery(@PathVariable Long queryId) {
        studentQueryService.deleteQuery(queryId);
        return ResponseEntity.ok(new ApiResponse("Query deleted successfully"));
    }
}
