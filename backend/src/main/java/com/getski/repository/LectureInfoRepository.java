package com.getski.repository;

import com.getski.model.LectureInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface LectureInfoRepository extends JpaRepository<LectureInfo, Long> {
    LectureInfo findByLectureInfoId(Long lectureInfoId);

    @Query(value = "Select lecture_id from lecture_info l where l.lecture_info_id=?1", nativeQuery = true)
    Long findLectureIdByLectureInfoId(Long lectureInfoId);

    @Query(value = "Select * from lecture_info l where l.lecture_id=?1", nativeQuery = true)
    Collection<LectureInfo> findLectureInfoByLectureId(Long lectureId);
}
