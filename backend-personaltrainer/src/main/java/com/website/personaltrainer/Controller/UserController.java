package com.website.personaltrainer.Controller;

import com.website.personaltrainer.DTO.*;
import com.website.personaltrainer.Model.User;
import com.website.personaltrainer.Service.UserService;
import com.website.personaltrainer.Util.AuthorityUtil;
import com.website.personaltrainer.Util.JwtUtil;
import com.website.personaltrainer.enums.AuthorityEnums;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}, allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;


    @PostMapping("/register")
    private ResponseEntity<?> createUser(@RequestBody UserDTO userDTO){
        userService.createUser(userDTO);
        try {
            Authentication authenticate = authenticationManager
                    .authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    userDTO.getUsername(), userDTO.getPassword()
                            )
                    );

            User user = (User) authenticate.getPrincipal();
            user.setPassword(null);
            Long userId= user.getId();
            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.AUTHORIZATION,
                            jwtUtil.generateToken(user, userId)
                    )
                    .body(user);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/registerTrainer")
    private ResponseEntity<?> createTrainer(@AuthenticationPrincipal User loggedInUser, @RequestBody TrainerDTO userData) {
        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), loggedInUser)) {
            userService.createTrainer(userData);
            try {
                Authentication authenticate = authenticationManager
                        .authenticate(
                                new UsernamePasswordAuthenticationToken(
                                        userData.getUsername(), userData.getPassword()
                                )
                        );

                User trainer = (User) authenticate.getPrincipal();
                trainer.setPassword(null);
                Long trainerId = trainer.getId();
                return ResponseEntity.ok()
                        .header(
                                HttpHeaders.AUTHORIZATION,
                                jwtUtil.generateToken(trainer, trainerId)
                        )
                        .body(trainer);
            } catch (BadCredentialsException ex) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);

        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/save")
    public ResponseEntity<?> saveUserProfileData(@AuthenticationPrincipal User loggedInUser, @RequestBody User editedData) {
        try {
            User savedUser = userService.updateUserProfileData(editedData, loggedInUser);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update user data: " + e.getMessage());
        }
    }

    @PutMapping("/saveTrainer")
    public ResponseEntity<?> saveTrainerProfileData(@AuthenticationPrincipal User loggedInUser,@RequestParam Long trainerId, @RequestBody User editedData){
        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), loggedInUser)){
            try{
                User savedUser = userService.updateTrainerProfileData(editedData, trainerId);
                return ResponseEntity.ok(savedUser);
            }catch (Exception e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update user data: " + e.getMessage());
            }
        }else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }

    @PutMapping("/savegoals/{userId}")
    public ResponseEntity<?> saveUserGoals(@AuthenticationPrincipal User loggedInUser, @PathVariable Long userId, @RequestBody Map<String, String> requestBody) {
        try {
            String editedGoals = requestBody.get("goals");
            User savedUser = userService.updateUserGoals(userId, editedGoals);

            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update user goals: " + e.getMessage());
        }
    }

    @GetMapping("/assigned")
    public ResponseEntity<?> getUsersAssignedToTrainer(@AuthenticationPrincipal User loggedInUser){
        List<User> userList = userService.getUsersAssignedToTrainer(loggedInUser);
        return ResponseEntity.ok(userList);
    }

    @GetMapping("/allclients")
    public ResponseEntity<?> getAllUsers(@AuthenticationPrincipal User loggedInUser){
        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), loggedInUser)){
            List<UserSearchDTO> userList = userService.getUsersWithTrainerNames();
            return ResponseEntity.ok(userList);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }

    @GetMapping("/alltrainers")
    public ResponseEntity<?> getAllTrainers(@AuthenticationPrincipal User loggedInUser){
        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), loggedInUser)){
            List<TrainerDataWithClientNumber> userList = userService.getTrainersWithClientNum();
            return ResponseEntity.ok(userList);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchForUsers(
            @RequestParam(name = "searchValue", required = false) String searchValue,
            @RequestParam(name = "filterValue", required = false) String filterValue,
            @AuthenticationPrincipal User user) {

        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_TRAINER.name(), user)) {
            List<User> matchingUsers;

            if (searchValue != null) {
                matchingUsers = userService.findUsersByTrainerIdAndFirstNameOrLastName(user, searchValue);
            } else {
                matchingUsers = userService.getUsersAssignedToTrainer(user);
            }
            return ResponseEntity.ok(matchingUsers);
        } else if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), user)) {

            List<UserSearchDTO> adminMatchingUsers = userService.queryBySearchParamsClients(searchValue, filterValue);

            return ResponseEntity.ok(adminMatchingUsers);

        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }

    @GetMapping("/searchTrainers")
    public ResponseEntity<?> searchForUsers(
            @RequestParam(name = "searchValue", required = false) String searchValue,
            @AuthenticationPrincipal User user) {
        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), user)) {
            List<TrainerDataWithClientNumber> adminMatchingTrainers = userService.queryBySearchParamsTrainers(searchValue);
            return ResponseEntity.ok(adminMatchingTrainers);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }

    @PostMapping("/changeEnabledStatus")
    public ResponseEntity<?> changeStatus(@AuthenticationPrincipal User loggedInUser, @RequestParam Long userId){
        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), loggedInUser)) {
            User updatedUser = userService.updateEnabledStatus(userId);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }

    @GetMapping("/getTrainers")
    public ResponseEntity<?> getTrainerDetails(@AuthenticationPrincipal User loggedInUser){
        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), loggedInUser)) {
            List<TrainerDetailsDTO> trainerDetails = userService.getTrainerDetails();
            return ResponseEntity.ok(trainerDetails);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }

    @PostMapping("/assignTrainer")
    public ResponseEntity<?> assignTrainer(
            @AuthenticationPrincipal User user,
            @RequestParam Long userId,
            @RequestParam String trainerId) {
        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), user)) {
            User updatedUser;
            if(trainerId.equals("unassign")){
                updatedUser = userService.unassignUser(userId);
            } else{
                updatedUser = userService.assignTrainerToUser(userId, Long.valueOf(trainerId));
            }
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }

}
