package com.website.personaltrainer.Repository;

import com.website.personaltrainer.Model.SuccessStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SuccessRepo extends JpaRepository<SuccessStory, Long> {

    @Query("SELECT s FROM SuccessStory s WHERE s.enabled = true")
    List<SuccessStory> findAllByEnabled();

    @Query("SELECT s FROM SuccessStory s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :searchValue, '%'))")
    List<SuccessStory> searchByName(String searchValue);
}
