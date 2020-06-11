package com.getski.repository;

import com.getski.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query(value = "select * from comment order by rate desc",nativeQuery = true)
    List<Comment> findAll();

    @Query(value = "Select avg(rate) from comment where lecture_id=?1" , nativeQuery = true)
    Double getAvgByLectureId(Long lecture_id);

    @Query(value = "select * from comment where lecture_id=?1 order by updated_at desc",nativeQuery = true)
    Collection<Comment> findAllByLectureId(Long lecture_id);
}
