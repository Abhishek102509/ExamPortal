package com.examportal.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExamResponseDTO extends BaseDTO {
    private String title;
    private String subject;
    private Integer totalMarks;
    private Integer durationMin;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<QuestionResponseDTO> questions = new ArrayList<>();
}
