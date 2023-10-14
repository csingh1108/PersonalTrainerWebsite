package com.website.personaltrainer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateWorkoutDTO {

    private String notes;
    private Long trainerId;
    private Long userId;
}
