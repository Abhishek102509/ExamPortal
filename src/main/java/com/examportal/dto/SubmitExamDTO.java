package com.examportal.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitExamDTO {
    
    @NotNull(message = "Exam ID must be provided")
    private Long examId;
    
    @NotEmpty(message = "Answers must be provided")
    @Valid
    private List<AnswerDTO> answers;
}
