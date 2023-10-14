package com.website.personaltrainer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchDTO {

    private Long userId;
    private String firstName;
    private String lastName;
    private String userName;
    private String phone;
    private String sex;
    private Integer age;
    private String address;
    private String trainerName;
    private Boolean enabledStatus;
}
