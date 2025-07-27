package com.examportal.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerDTO {
    
    @NotNull(message = "Question ID must be provided")
    private Long questionId;
    
    @Pattern(regexp = "[ABCD]", message = "Selected option must be A, B, C, or D")
    private String selectedOption;
}
