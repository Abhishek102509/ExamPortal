package com.examportal.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
    
    @Column(length = 50, nullable = false)
    private String username;
    
    @Column(length = 50, nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String query;

    public StudentQuery(String username, String title, String query) {
        this.username = username;
        this.title = title;
        this.query = query;
    }
}
