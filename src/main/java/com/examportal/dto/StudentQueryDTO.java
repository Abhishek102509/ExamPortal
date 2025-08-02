package com.examportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentQueryDTO {
    
    @NotBlank(message = "Title must be provided")
    private String title;
    
    @NotBlank(message = "Subject must be provided")
    private String subject;
    
    @NotBlank(message = "Query must be provided")
    private String query;
}
