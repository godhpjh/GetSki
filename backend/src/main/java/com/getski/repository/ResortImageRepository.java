package com.getski.repository;

import com.getski.model.ResortImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface ResortImageRepository extends JpaRepository<ResortImage, String> {
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query(value = "Delete from resort_images where id = ?1", nativeQuery = true)
    void deleteImageById(String imageId);

    @Query(value = "Select * from resort_images r where r.resort_id = ?1", nativeQuery = true)
    List<ResortImage> getResortImageById(Long resortId);

    @Query(value = "Select * from resort_images r where r.resort_id = ?1 and r.image_type = ?2", nativeQuery = true)
    List<ResortImage> getResortImageByType(Long resortId, String imageType);
}
