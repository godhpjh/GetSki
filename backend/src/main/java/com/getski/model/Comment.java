package com.getski.model;

import com.getski.model.audit.DateAudit;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
@Entity
@Table(name = "Comment")
public class Comment extends DateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @OnDelete(action = OnDeleteAction.CASCADE)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @OnDelete(action = OnDeleteAction.CASCADE)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lecture_id")
    private Lecture lecture;

    @NotBlank
    @Size(max = 500)
    private String commentDescription;

    @NotNull
    private int rate;

    public Comment() {
    }

    public Comment(String commentDescription, int rate) {
        this.commentDescription = commentDescription;
        this.rate = rate;
    }

    public Comment(String commentDescription, int rate, User user, Lecture lecture) {
        this.commentDescription = commentDescription;
        this.rate = rate;
        this.user = user;
        this.lecture = lecture;
    }

//    public Long getUser() {
//        return user.getId();
//    }
    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

//    public Long getLecture() {
//        return lecture.getLectureId();
//    }
    public Lecture getLecture() {
        return this.lecture;
    }

    public void setLecture(Lecture lecture) {
        this.lecture = lecture;
    }
}
