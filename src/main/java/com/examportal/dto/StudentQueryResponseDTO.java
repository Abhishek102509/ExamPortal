package com.examportal.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentQueryResponseDTO extends BaseDTO {
    private String username;
    private String title;
    private String subject;
    private String query;
    private String response;
    private String status;
    private LocalDateTime respondedAt;
}
