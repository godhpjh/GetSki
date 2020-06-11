package com.getski.repository;

import com.getski.model.Resort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface ResortRepository extends JpaRepository<Resort, Long> {
    Resort findByResortName(String resortName);

    Resort findByResortId(Long resortId);

    @Query(value = "Select * from resorts r where r.region = ?1", nativeQuery = true)
    Collection<Resort> findByResortRegion(int region);

    @Query(value = "Select distinct region from resorts", nativeQuery = true)
    Collection<Integer> getAllRegion();
}
