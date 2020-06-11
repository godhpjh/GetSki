package com.getski.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name = "resorts")
public class Resort {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resortId;

    @NotBlank
    @Size(max = 40)
    private String resortName;

    @NotBlank
    @Size(max = 100)
    private String location;

    @NotNull
    private int region;

    @Size(max = 255)
    private String intro;

    @Size(max = 255)
    private String pageLink;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            mappedBy = "resort")
    private Set<Lecture> lecture = new HashSet<>();

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            mappedBy = "resort")
    private Set<ResortImage> resortImage = new HashSet<>();


    public Resort() {

    }

    public Resort(String resortName, String location, int region, String intro, String pageLink) {
        this.resortName = resortName;
        this.location = location;
        this.region = region;
        this.intro = intro;
        this.pageLink = pageLink;
    }
}