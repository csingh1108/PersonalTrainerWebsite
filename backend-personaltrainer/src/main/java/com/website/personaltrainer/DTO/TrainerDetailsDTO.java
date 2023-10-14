package com.website.personaltrainer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerDetailsDTO {

    private Long trainerId;
    private String firstName;
    private String lastName;
}
