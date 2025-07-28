//package com.examportal.entities;
//
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.FetchType;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
//import jakarta.persistence.Table;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import lombok.ToString;
//
//@Entity
//@Table(name = "questions")
//@NoArgsConstructor
//@Getter
//@Setter
//@ToString(callSuper = true)
//public class Question extends BaseEntity {
//    
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "exam_id", nullable = false)
//    private Exam exam;
//    
//    @Column(columnDefinition = "TEXT", nullable = false)
//    private String questionText;
//    
//    @Column(length = 100, nullable = false)
//    private String optionA;
//    
//    @Column(length = 100, nullable = false)
//    private String optionB;
//    
//    @Column(length = 100, nullable = false)
//    private String optionC;
//    
//    @Column(length = 100, nullable = false)
//    private String optionD;
//    
//    @Column(length = 1, nullable = false)
//    private String correctOption;
//    
//    @Column(nullable = false)
//    private Integer marks;
//
//    public Question(Exam exam, String questionText, String optionA, String optionB, 
//                   String optionC, String optionD, String correctOption, Integer marks) {
//        this.exam = exam;
//        this.questionText = questionText;
//        this.optionA = optionA;
//        this.optionB = optionB;
//        this.optionC = optionC;
//        this.optionD = optionD;
//        this.correctOption = correctOption;
//        this.marks = marks;
//    }
//}







package com.examportal.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true, exclude = "answers")
public class Question extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(length = 100, nullable = false)
    private String optionA;

    @Column(length = 100, nullable = false)
    private String optionB;

    @Column(length = 100, nullable = false)
    private String optionC;

    @Column(length = 100, nullable = false)
    private String optionD;

    @Column(length = 1, nullable = false)
    private String correctOption;

    @Column(nullable = false)
    private Integer marks;


    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();

    public Question(Exam exam, String questionText, String optionA, String optionB,
                    String optionC, String optionD, String correctOption, Integer marks) {
        this.exam = exam;
        this.questionText = questionText;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctOption = correctOption;
        this.marks = marks;
    }
}
