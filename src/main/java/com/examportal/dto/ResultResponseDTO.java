package com.examportal.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResultResponseDTO extends BaseDTO {
    private String username;
    private String examTitle;
    private Integer totalScore;
    private Integer totalMarks;
    private String status;
    private Double percentage;
    private java.time.LocalDateTime createdOn;
}
