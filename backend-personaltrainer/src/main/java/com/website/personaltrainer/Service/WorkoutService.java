package com.website.personaltrainer.Service;

import com.website.personaltrainer.DTO.ProfileNotesDTO;
import com.website.personaltrainer.Model.WorkoutNotes;
import com.website.personaltrainer.Repository.WorkoutRepo;
import com.website.personaltrainer.enums.WorkoutNotesStatusEnums;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepo workoutRepo;

    public List<ProfileNotesDTO> getAllWorkoutProfileDTOs(Long userId) {
        List<WorkoutNotes> workoutNotesList = workoutRepo.findByUser_Id(userId);

        return workoutNotesList.stream().map(workoutNotes -> {
            ProfileNotesDTO dto = new ProfileNotesDTO();
            dto.setWorkoutId(workoutNotes.getId());
            dto.setCreatedDate(workoutNotes.getCreatedDate());
            dto.setLastUpdateDate(workoutNotes.getLastUpdatedDate());
            if (workoutNotes.getTrainer() != null) {
                dto.setTrainerFirstName(workoutNotes.getTrainer().getFirstName());
                dto.setTrainerLastName(workoutNotes.getTrainer().getLastName());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public WorkoutNotes getWorkoutNote(Long workoutId) {
        return workoutRepo.findById(workoutId).orElse(new WorkoutNotes());
    }

    public WorkoutNotes createWorkoutNote(WorkoutNotes workoutNote) {
        return workoutRepo.save(workoutNote);
    }



    public WorkoutNotes updateWorkoutNotes(Long workoutId, String editedNotes) {

        WorkoutNotes workout = workoutRepo.findById(workoutId)
                .orElseThrow(() -> new EntityNotFoundException("Workout not found"));
        workout.setNotes(editedNotes);
        workout.setLastUpdatedDate(LocalDateTime.now());
        return workoutRepo.save(workout);
    }

    public void deleteWorkoutNoteById(Long workoutId) {
        workoutRepo.deleteById(workoutId);
    }
}
