package com.examportal.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseDTO {
    private Long id;
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;
}
