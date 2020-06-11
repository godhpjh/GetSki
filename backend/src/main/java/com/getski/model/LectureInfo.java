package com.getski.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@ToString
@Getter
@Setter
@Entity
@Table(name = "lecture_info")
public class LectureInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lectureInfoId;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecture_id")
    private Lecture lecture;

    private Long lid;

    private String lectureDate;

    private String lectureTime;

    public LectureInfo() {
    }

    public LectureInfo(Lecture lecture, String lectureDate, String lectureTime) {
        this.lecture = lecture;
        this.lectureDate = lectureDate;
        this.lectureTime = lectureTime;
    }

    public LectureInfo(String lectureDate, String lectureTime) {
        this.lectureDate = lectureDate;
        this.lectureTime = lectureTime;
    }
}
