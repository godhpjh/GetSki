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
@Table(name = "resort_images")
public class ResortImage extends DateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    private String fileName;

    private String fileType;

    private String fileUri;

    private Long fileSize;

    private String imageType;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resort_id")
    private Resort resort;

    public ResortImage() {

    }

    public ResortImage(String fileName, String fileType, String fileUri, Long fileSize, String imageType) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileUri = fileUri;
        this.fileSize = fileSize;
        this.imageType = imageType;
    }
}
