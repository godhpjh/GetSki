package com.getski.repository;

import com.getski.model.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collection;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {
    Lecture findByLectureName(String lectureName);

    @Query(value = "Select * from lectures l where l.lecture_id = ?1", nativeQuery = true)
    Lecture findByLectureId(Long lectureId);

    @Query(value = "Select * from lectures l where l.resort_id = ?1", nativeQuery = true)
    ArrayList<Lecture> getLectureByResortId(Long resortId);

    @Query(value = "Select * from lectures l where l.instructor_id = ?1", nativeQuery = true)
    Collection<Lecture> getLectureByInstructorId(Long instructorId);

    @Query(value = "Select resort_id from lectures l where l.lecture_id = ?1", nativeQuery = true)
    Long getResortIdByLectureId(Long lectureid);
}
