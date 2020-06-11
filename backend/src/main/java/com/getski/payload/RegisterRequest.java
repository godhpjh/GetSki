package com.getski.payload;

import javax.validation.constraints.NotNull;

public class RegisterRequest {
    @NotNull
    private Long userId;

    @NotNull
    private Long lectureId;

    @NotNull
    private Long lectureInfoId;

    private int headCount;

    public int getHeadCount() {
        return headCount;
    }

    public void setHeadCount(int headCount) {
        this.headCount = headCount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getLectureId() {
        return lectureId;
    }

    public void setLectureId(Long lectureId) {
        this.lectureId = lectureId;
    }

    public Long getLectureInfoId() {
        return lectureInfoId;
    }

    public void setLectureInfoId(Long lectureInfoId) {
        this.lectureInfoId = lectureInfoId;
    }
}
