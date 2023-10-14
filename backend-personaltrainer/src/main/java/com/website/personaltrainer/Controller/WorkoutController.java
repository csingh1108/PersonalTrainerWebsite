package com.website.personaltrainer.Controller;

import com.website.personaltrainer.DTO.CreateWorkoutDTO;
import com.website.personaltrainer.DTO.ProfileNotesDTO;
import com.website.personaltrainer.DTO.WorkoutDetailDTO;
import com.website.personaltrainer.Model.User;
import com.website.personaltrainer.Model.WorkoutNotes;
import com.website.personaltrainer.Service.UserService;
import com.website.personaltrainer.Service.WorkoutService;
import com.website.personaltrainer.Util.AuthorityUtil;
import com.website.personaltrainer.enums.AuthorityEnums;
import com.website.personaltrainer.enums.WorkoutNotesStatusEnums;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api/workout")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @Autowired
    private UserService userService;

    @GetMapping("/profile-workout-notes")
    public ResponseEntity<List<ProfileNotesDTO>> getAllWorkoutNotesDTOs(
            @AuthenticationPrincipal User user,
            @RequestParam Long userId
    ) {
        List<ProfileNotesDTO> dtos = workoutService.getAllWorkoutProfileDTOs(userId);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("")
    public ResponseEntity<WorkoutDetailDTO> getWorkoutNote(
            @AuthenticationPrincipal User user,
            @RequestParam Long workoutId) {
        WorkoutNotes note = workoutService.getWorkoutNote(workoutId);

        WorkoutDetailDTO dto = new WorkoutDetailDTO();
        dto.setNotes(note.getNotes());
        dto.setImgUrl(note.getImgUrl());

        if (note.getTrainer() != null) {
            dto.setTrainerFirstName(note.getTrainer().getFirstName());
            dto.setTrainerLastName(note.getTrainer().getLastName());
        }
        dto.setCreatedDate(note.getCreatedDate());
        dto.setLastUpdatedDate(note.getLastUpdatedDate());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createWorkoutNote(
            @AuthenticationPrincipal User user,
            @RequestBody CreateWorkoutDTO workoutNote) {
        try {
            if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), user) ||
                    AuthorityUtil.hasRole(AuthorityEnums.ROLE_TRAINER.name(), user)) {


                WorkoutNotes workoutNotesEntity = new WorkoutNotes();
                workoutNotesEntity.setNotes(workoutNote.getNotes());


                User userEntity = userService.findById(workoutNote.getUserId());
                User trainerEntity = userService.findById(workoutNote.getTrainerId());

                workoutNotesEntity.setUser(userEntity);
                workoutNotesEntity.setTrainer(trainerEntity);
                workoutNotesEntity.setStatus(WorkoutNotesStatusEnums.UNREAD);
                workoutNotesEntity.setCreatedDate(LocalDateTime.now());
                workoutNotesEntity.setLastUpdatedDate(LocalDateTime.now());

                WorkoutNotes savedWorkoutNote = workoutService.createWorkoutNote(workoutNotesEntity);
                return ResponseEntity.ok(savedWorkoutNote);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have the required authority to create a workout note.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateWorkoutNotes(
            @RequestParam Long workoutId,
            @RequestParam String editedNotes,
            @AuthenticationPrincipal User user) {

        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), user) ||
                AuthorityUtil.hasRole(AuthorityEnums.ROLE_TRAINER.name(), user)) {
            try {
                WorkoutNotes updatedWorkout = workoutService.updateWorkoutNotes(workoutId, editedNotes);
                return ResponseEntity.ok(updatedWorkout);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteWorkoutNote(@RequestParam Long workoutId) {
        try {
            workoutService.deleteWorkoutNoteById(workoutId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while deleting the workout note", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}

