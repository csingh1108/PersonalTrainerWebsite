package com.website.personaltrainer.Service;

import com.website.personaltrainer.DTO.*;
import com.website.personaltrainer.Model.Authority;
import com.website.personaltrainer.Model.Trainer;
import com.website.personaltrainer.Model.User;
import com.website.personaltrainer.Repository.AuthoritiesRepo;
import com.website.personaltrainer.Repository.UserRepo;
import com.website.personaltrainer.Util.CustomPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private AuthoritiesRepo authoritiesRepo;
    @Autowired
    private CustomPasswordEncoder customPasswordEncoder;

    public void createUser(UserDTO userDto) {
        User newUser = new User();
        newUser.setFirstName(userDto.getFirstName());
        newUser.setLastName(userDto.getLastName());
        newUser.setUsername(userDto.getUsername());
        String encodedPassword = customPasswordEncoder.getPasswordEncoder().encode(userDto.getPassword());
        newUser.setPassword(encodedPassword);
        newUser.setEnabled(true);
        userRepo.save(newUser);
        Authority authority = new Authority();
        authority.setAuthority("ROLE_CLIENT");
        authority.setUser(newUser);
        authoritiesRepo.save(authority);
    }

    public void createTrainer(TrainerDTO userData) {
        User trainer = new User();
        trainer.setFirstName(userData.getFirstName());
        trainer.setLastName(userData.getLastName());
        trainer.setUsername(userData.getUsername());
        trainer.setSex(userData.getSex());
        trainer.setAge(userData.getAge());
        trainer.setAddress(userData.getAddress());
        trainer.setPhone(userData.getPhone());
        String encodedPassword = customPasswordEncoder.getPasswordEncoder().encode(userData.getPassword());
        trainer.setPassword(encodedPassword);
        trainer.setEnabled(true);
        userRepo.save(trainer);
        Authority authority = new Authority();
        authority.setAuthority("ROLE_TRAINER");
        authority.setUser(trainer);
        authoritiesRepo.save(authority);
    }

    public User getUserById(Long userId) {
        return userRepo.findById(userId).orElse(null);
    }

    public User updateUserProfileData(User editedData, User user) {

        user.setAddress(editedData.getAddress());
        user.setPhone(editedData.getPhone());
        user.setAge(editedData.getAge());
        user.setSex(editedData.getSex());

        return userRepo.save(user);
    }

    public User updateTrainerProfileData(User editedData, Long trainerId) {
        Optional<User> trainerOpt = userRepo.findById(trainerId);
        if(trainerOpt.isPresent()){
            User trainer = trainerOpt.get();
            trainer.setFirstName(editedData.getFirstName());
            trainer.setLastName(editedData.getLastName());
            trainer.setAge(editedData.getAge());
            trainer.setSex(editedData.getSex());
            trainer.setAddress(editedData.getAddress());
            trainer.setPhone(editedData.getPhone());
            return userRepo.save(trainer);
        }else{
            throw new NoSuchElementException("User not found with userId: " + trainerId);
        }
    }

    public List<User> getUsersAssignedToTrainer(User user) {
        return userRepo.findAllByTrainerId(user.getId(), true);
    }

    public User updateUserGoals(Long userId, String editedGoals) {
        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setWorkoutGoals(editedGoals);
            return userRepo.save(user);
        } else {
            throw new NoSuchElementException("User not found with userId: " + userId);
        }
    }

    public User findById(Long userId) {
        return userRepo.findById(userId).orElse(new User());
    }

    public List<User> findUsersByTrainerIdAndFirstNameOrLastName(User user, String searchValue) {
        Long trainerId = user.getId();
        String searchValueLower = searchValue.toLowerCase();
        String searchValueWithWildcards = "%" + searchValueLower + "%";
        return userRepo.findUsersByTrainerIdAndNameComponents(trainerId, searchValueWithWildcards);
    }

    public List<UserSearchDTO> getUsersWithTrainerNames() {
        List<User> users = userRepo.findAllUsersByClientRole("ROLE_CLIENT");
        List<UserSearchDTO> userDTOs = new ArrayList<>();

        for (User user : users) {
            UserSearchDTO userDTO = new UserSearchDTO();
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setUserName(user.getUsername());
            userDTO.setPhone(user.getPhone());
            userDTO.setSex(user.getSex());
            userDTO.setAge((user.getAge()));
            userDTO.setAddress(user.getAddress());
            userDTO.setEnabledStatus(user.getEnabled());
            userDTO.setUserId(user.getId());

            if (user.getTrainerId() != null) {
                Optional<User> trainerOpt = userRepo.findById(user.getTrainerId());
                if (trainerOpt.isPresent()) {
                    User trainer = trainerOpt.get();
                    userDTO.setTrainerName(trainer.getFirstName() + " " + trainer.getLastName());
                }
            }
            userDTOs.add(userDTO);
        }
        return userDTOs;
    }

    public List<UserSearchDTO> queryBySearchParamsClients(String searchValue, String filterValue) {
        List<User> users = new ArrayList<>();
        String searchValueLower = searchValue.toLowerCase();
        String searchValueWithWildcards = "%" + searchValueLower + "%";

        if ("trainer".equals(filterValue)) {
            List<User> trainers = userRepo.findTrainersByName(searchValueWithWildcards);

            if (!trainers.isEmpty()) {
                List<Long> trainerIds = trainers.stream()
                        .map(User::getId)
                        .collect(Collectors.toList());

                users = userRepo.findClientsByTrainerIds(trainerIds);
            }
        } else if ("unassigned".equals(filterValue)) {
            users = userRepo.findUnassignedClientsByName(searchValueWithWildcards);
        } else if ("client".equals(filterValue)) {
            users = userRepo.findClientsByName(searchValueWithWildcards);
        }

        return convertUsersToUserSearchDTO(users);
    }

    private List<UserSearchDTO> convertUsersToUserSearchDTO(List<User> users) {
        List<UserSearchDTO> userSearchDTOs = new ArrayList<>();
        for (User user : users) {
            UserSearchDTO userSearchDTO = convertUserToUserSearchDTO(user);
            userSearchDTOs.add(userSearchDTO);
        }
        return userSearchDTOs;
    }

    private UserSearchDTO convertUserToUserSearchDTO(User user) {
        UserSearchDTO userSearchDTO = new UserSearchDTO();
        userSearchDTO.setFirstName(user.getFirstName());
        userSearchDTO.setLastName(user.getLastName());
        userSearchDTO.setUserName(user.getUsername());
        userSearchDTO.setPhone(user.getPhone());
        userSearchDTO.setSex(user.getSex());
        userSearchDTO.setAge(user.getAge());
        userSearchDTO.setAddress(user.getAddress());
        userSearchDTO.setUserId(user.getId());

        if (user.getTrainerId() != null) {
            Optional<User> trainerOpt = userRepo.findById(user.getTrainerId());
            if (trainerOpt.isPresent()) {
                User trainer = trainerOpt.get();
                userSearchDTO.setTrainerName(trainer.getFirstName() + " " + trainer.getLastName());
            }
        }

        userSearchDTO.setEnabledStatus(user.getEnabled());

        return userSearchDTO;
    }

    public User updateEnabledStatus(Long userId) {
        Optional<User> userOpt = userRepo.findById(userId);
        if(userOpt.isPresent()){
            User user = userOpt.get();
            Boolean current = user.getEnabled();
            user.setEnabled(!current);
            return userRepo.save(user);
        } else{
            return null;
        }
    }

    public List<TrainerDetailsDTO> getTrainerDetails() {
        List<User> trainers= userRepo.findAllEnabledUsersByClientRole("ROLE_TRAINER");
        List<TrainerDetailsDTO> trainerDetailsDTOS = new ArrayList<>();

        for (User trainer : trainers) {
            TrainerDetailsDTO trainerDetailsDTO = new TrainerDetailsDTO();
            trainerDetailsDTO.setFirstName(trainer.getFirstName());
            trainerDetailsDTO.setLastName(trainer.getLastName());
            trainerDetailsDTO.setTrainerId(trainer.getId());

            trainerDetailsDTOS.add(trainerDetailsDTO);
        }
        return trainerDetailsDTOS;
    }

    public User assignTrainerToUser(Long userId, Long trainerId) {
        Optional<User> userOpt = userRepo.findById(userId);
        if(userOpt.isPresent()){
            User user = userOpt.get();
            user.setTrainerId(trainerId);
            return userRepo.save(user);
        } else {
            return null;
        }
    }


    public List<TrainerDataWithClientNumber> getTrainersWithClientNum() {
        List<User> trainers = userRepo.findAllTrainers();
        List<TrainerDataWithClientNumber> trainersWithClientNum = new ArrayList<>();

        for (User trainer : trainers) {
            TrainerDataWithClientNumber trainerDataWithClientNumber = createTrainerFullDataDTO(trainer);
            trainersWithClientNum.add(trainerDataWithClientNumber);
        }

        return trainersWithClientNum;
    }

    private TrainerDataWithClientNumber createTrainerFullDataDTO(User trainer) {
        Long trainerId = trainer.getId();
        List<User> clients = userRepo.findEnabledClientsByTrainerIdAndRole(trainerId, "ROLE_CLIENT");
        int numberOfClients = clients.size();

        TrainerDataWithClientNumber trainerDataWithClientNumber = new TrainerDataWithClientNumber();
        trainerDataWithClientNumber.setTrainer(trainer);
        trainerDataWithClientNumber.setNumOfClients(numberOfClients);

        return trainerDataWithClientNumber;
    }


    public User unassignUser(Long userId) {
        Optional<User> userOpt = userRepo.findById(userId);
        if(userOpt.isPresent()){
            User user = userOpt.get();
            user.setTrainerId(null);
            return userRepo.save(user);
        } else {
            return null;
        }
    }

    public List<TrainerDataWithClientNumber> queryBySearchParamsTrainers(String searchValue) {
        List<User> trainers;
        String searchValueLower = searchValue.toLowerCase();
        String searchValueWithWildcards = "%" + searchValueLower + "%";

        trainers = userRepo.findTrainersByName(searchValueWithWildcards);
        List<TrainerDataWithClientNumber> trainerDataWithClientNumberList = new ArrayList<>();

        for(User trainer: trainers){
            TrainerDataWithClientNumber trainerDataWithClientNumber = createTrainerFullDataDTO(trainer);
            trainerDataWithClientNumberList.add(trainerDataWithClientNumber);
        }
        return trainerDataWithClientNumberList;
    }



}
