package com.website.personaltrainer.Repository;

import com.website.personaltrainer.Model.WorkoutNotes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface WorkoutRepo extends JpaRepository<WorkoutNotes, Long> {

    List<WorkoutNotes> findByUser_Id(@Param("userId") Long userId);
}
