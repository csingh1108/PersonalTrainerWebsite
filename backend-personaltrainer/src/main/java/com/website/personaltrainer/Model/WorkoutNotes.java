package com.website.personaltrainer.Model;

import com.website.personaltrainer.enums.WorkoutNotesStatusEnums;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutNotes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String notes;
    private String imgUrl;
    private LocalDateTime createdDate;
    private LocalDateTime lastUpdatedDate;

    @Enumerated(EnumType.STRING)
    private WorkoutNotesStatusEnums status;

    @ManyToOne
    private User user;

    @ManyToOne
    private User trainer;
}
