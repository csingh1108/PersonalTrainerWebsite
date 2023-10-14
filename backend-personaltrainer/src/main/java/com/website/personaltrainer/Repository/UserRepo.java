package com.website.personaltrainer.Repository;

import com.website.personaltrainer.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query("Select u from User u where u.trainerId = :trainerId AND " +
            "u.enabled = :b")
    List<User> findAllByTrainerId(Long trainerId, boolean b);

    @Query("SELECT u FROM User u WHERE u.trainerId = :trainerId AND " +
            "(LOWER(u.firstName) LIKE LOWER(:searchValue) OR " +
            " LOWER(u.lastName) LIKE LOWER(:searchValue) OR " +
            "LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(:searchValue)) AND " +
            "u.enabled = true")
    List<User> findUsersByTrainerIdAndNameComponents(
            @Param("trainerId") Long trainerId,
            @Param("searchValue") String searchValue);


    @Query("SELECT u FROM User u JOIN u.authorities a WHERE a.authority = :role")
    List<User> findAllUsersByClientRole(@Param("role") String role);

    @Query("SELECT u FROM User u JOIN u.authorities a WHERE a.authority = :role AND u.enabled=true")
    List<User> findAllEnabledUsersByClientRole(@Param("role") String role);

    @Query("SELECT u FROM User u JOIN u.authorities a WHERE a.authority= 'ROLE_TRAINER' AND" +
            "(LOWER(u.firstName) LIKE LOWER(:searchValue) OR " +
            " LOWER(u.lastName) LIKE LOWER(:searchValue) OR " +
            "LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(:searchValue))")
    List<User> findTrainersByName(@Param("searchValue") String searchValue);

    @Query("SELECT u FROM User u JOIN u.authorities a " +
            "WHERE a.authority = 'ROLE_CLIENT' " +
            "AND (LOWER(u.firstName) LIKE LOWER(:searchValue) OR " +
            "LOWER(u.lastName) LIKE LOWER(:searchValue) OR " +
            "LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(:searchValue)) " +
            "AND u.trainerId IS NULL")
    List<User> findUnassignedClientsByName(@Param("searchValue") String searchValue);


    @Query("SELECT u FROM User u JOIN u.authorities a " +
            "WHERE a.authority = 'ROLE_CLIENT' " +
            "AND (LOWER(u.firstName) LIKE LOWER(:searchValue) OR " +
            "LOWER(u.lastName) LIKE LOWER(:searchValue) OR " +
            "LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(:searchValue)) ")
    List<User> findClientsByName(@Param("searchValue") String searchValue);


    @Query("SELECT u FROM User u JOIN u.authorities a " +
            "WHERE a.authority = 'ROLE_CLIENT' " +
            "AND u.trainerId IS NOT NULL " +
            "AND u.trainerId IN :trainerIds")
    List<User> findClientsByTrainerIds(@Param("trainerIds") List<Long> trainerIds);

    @Query("SELECT u FROM User u JOIN u.authorities a WHERE a.authority = 'ROLE_TRAINER'")
    List<User> findAllTrainers();

    @Query("SELECT u FROM User u JOIN u.authorities a " +
            "WHERE a.authority = :clientRole " +
            "AND u.trainerId = :trainerId " +
            "AND u.enabled = true")
    List<User> findEnabledClientsByTrainerIdAndRole(@Param("trainerId") Long trainerId, @Param("clientRole") String clientRole);

}

