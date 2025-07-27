package com.examportal.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "results")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true)
public class Result extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;
    
    @Column(nullable = false)
    private Integer totalScore;
    
    @Column(length = 20, nullable = false)
    private String status;

    public Result(User user, Exam exam, Integer totalScore, String status) {
        this.user = user;
        this.exam = exam;
        this.totalScore = totalScore;
        this.status = status;
    }
}
