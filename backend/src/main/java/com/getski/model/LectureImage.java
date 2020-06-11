package com.getski.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.getski.model.audit.DateAudit;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "lecture_images")
public class LectureImage extends DateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    private String fileName;

    private String fileType;

    private String fileUri;

    private Long fileSize;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecture_id")
    private Lecture lecture;

    public LectureImage() {

    }

    public LectureImage(String fileName, String fileType, String fileUri, Long fileSize) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileUri = fileUri;
        this.fileSize = fileSize;
    }
}
