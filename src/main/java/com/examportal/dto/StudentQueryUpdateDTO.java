package com.examportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentQueryUpdateDTO {
    
    @NotBlank(message = "Response must be provided")
    private String response;
    
    @NotBlank(message = "Status must be provided")
    private String status;
}
