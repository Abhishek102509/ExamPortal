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
@Table(name = "student_queries")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true)
public class StudentQuery extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @Column(length = 50, nullable = false)
    private String username;
    
    @Column(length = 100, nullable = false)
    private String title;
    
    @Column(length = 50, nullable = false)
    private String subject;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String query;
    
    @Column(columnDefinition = "TEXT")
    private String response;
    
    @Column(length = 20, nullable = false)
    private String status = "PENDING";
    
    @Column(name = "responded_at")
    private java.time.LocalDateTime respondedAt;

    public StudentQuery(User student, String title, String subject, String query) {
        this.student = student;
        this.username = student.getUsername();
        this.title = title;
        this.subject = subject;
        this.query = query;
        this.status = "PENDING";
    }
}
