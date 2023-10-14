package com.website.personaltrainer.DTO;

import com.website.personaltrainer.enums.WorkoutNotesStatusEnums;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutDetailDTO {

    private String notes;
    private String imgUrl;
    private String trainerFirstName;
    private String trainerLastName;
    private LocalDateTime createdDate;
    private LocalDateTime lastUpdatedDate;
    private WorkoutNotesStatusEnums status;

}
