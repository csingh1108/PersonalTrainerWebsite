package com.website.personaltrainer.DTO;

import com.website.personaltrainer.Model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerDataWithClientNumber {

    User trainer;
    int numOfClients;
}
