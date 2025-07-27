package com.examportal.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "exams")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true, exclude = "questions")
public class Exam extends BaseEntity {
    
    @Column(length = 50, nullable = false)
    private String title;
    
    @Column(length = 50, nullable = false)
    private String subject;
    
    @Column(nullable = false)
    private Integer totalMarks;
    
    @Column(nullable = false)
    private Integer durationMin;
    
    @Column(nullable = false)
    private LocalDateTime startTime;
    
    @Column(nullable = false)
    private LocalDateTime endTime;
    
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Question> questions = new ArrayList<>();

    public Exam(String title, String subject, Integer totalMarks, Integer durationMin, 
                LocalDateTime startTime, LocalDateTime endTime) {
        this.title = title;
        this.subject = subject;
        this.totalMarks = totalMarks;
        this.durationMin = durationMin;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public void addQuestion(Question question) {
        this.questions.add(question);
        question.setExam(this);
    }

    public void removeQuestion(Question question) {
        this.questions.remove(question);
        question.setExam(null);
    }
}
