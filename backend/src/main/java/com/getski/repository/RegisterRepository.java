package com.getski.repository;

import com.getski.model.Register;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface RegisterRepository extends JpaRepository<Register, Long> {
    @Query(value = "Select lecture_id from registers r where r.user_id = ?1", nativeQuery = true)
    Collection<Long> findLectureIdsByUserId(Long UserId);

    @Query(value="select count(*) from registers r where r.lecture_info_id=?1", nativeQuery = true)
    int getCurrentAmountPeople(Long lectureInfoId);

    @Query(value = "Select lecture_info_id from registers r where r.user_id=?1",nativeQuery = true)
    Collection<Long> findLectureInfoIdByUserId(Long userId);
}
