package com.website.personaltrainer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileNotesDTO {

    private Long workoutId;

    private LocalDateTime createdDate;
    private LocalDateTime lastUpdateDate;

    private String trainerFirstName;
    private String trainerLastName;
}
