package com.getski.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.getski.model.audit.DateAudit;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "lectures")
public class Lecture extends DateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lectureId;

    @NotBlank
    @Size(max = 100)
    private String lectureName;

    @NotNull
    private Long instructorId;

    @Size(max = 45)
    private String lecturePrice;

    @NotBlank
    @Size(max = 255)
    private String lectureDescription;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "resort_id")
    private Resort resort;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            mappedBy = "lecture")
    private Set<LectureImage> lectureImage = new HashSet<>();

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            mappedBy = "lecture")
    private Set<LectureInfo> lectureInfos = new HashSet<>();

    private int capacity;

    public Lecture() {
    }

    public Lecture(String lectureName, Long instructorId, String lecturePrice, String lectureDescription, int capacity) {
        this.lectureName = lectureName;
        this.instructorId = instructorId;
        this.lecturePrice = lecturePrice;
        this.lectureDescription = lectureDescription;
        this.capacity = capacity;
    }
}
