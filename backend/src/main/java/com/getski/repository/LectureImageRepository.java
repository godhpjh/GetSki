package com.getski.repository;

import com.getski.model.LectureImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface LectureImageRepository extends JpaRepository<LectureImage, String> {
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query(value = "Delete from lecture_images where lecture_id = ?1", nativeQuery = true)
    void deleteImageByLectureId(Long lectureId);

    @Query(value = "Select * from lecture_images l where l.lecture_id = ?1", nativeQuery = true)
    List<LectureImage> getLectureImageByLectureId(Long lectureId);

}
