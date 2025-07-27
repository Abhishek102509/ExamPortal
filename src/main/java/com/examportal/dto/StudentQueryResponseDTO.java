package com.examportal.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentQueryResponseDTO extends BaseDTO {
    private String username;
    private String title;
    private String query;
}
