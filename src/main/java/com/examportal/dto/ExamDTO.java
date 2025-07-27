package com.examportal.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExamDTO {
    
    @NotBlank(message = "Title must be provided")
    private String title;
    
    @NotBlank(message = "Subject must be provided")
    private String subject;
    
    @NotNull(message = "Total marks must be provided")
    @Positive(message = "Total marks must be positive")
    private Integer totalMarks;
    
    @NotNull(message = "Duration must be provided")
    @Positive(message = "Duration must be positive")
    private Integer durationMin;
    
    @NotNull(message = "Start time must be provided")
    private LocalDateTime startTime;
    
    @NotNull(message = "End time must be provided")
    private LocalDateTime endTime;
}
