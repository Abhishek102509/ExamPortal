package com.examportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionDTO {
    
    @NotNull(message = "Exam ID must be provided")
    private Long examId;
    
    @NotBlank(message = "Question text must be provided")
    private String questionText;
    
    @NotBlank(message = "Option A must be provided")
    private String optionA;
    
    @NotBlank(message = "Option B must be provided")
    private String optionB;
    
    @NotBlank(message = "Option C must be provided")
    private String optionC;
    
    @NotBlank(message = "Option D must be provided")
    private String optionD;
    
    @NotBlank(message = "Correct option must be provided")
    @Pattern(regexp = "[ABCD]", message = "Correct option must be A, B, C, or D")
    private String correctOption;
    
    @NotNull(message = "Marks must be provided")
    @Positive(message = "Marks must be positive")
    private Integer marks;
}
