package com.website.personaltrainer.Controller;

import com.website.personaltrainer.Model.SuccessStory;
import com.website.personaltrainer.Model.User;
import com.website.personaltrainer.Service.SuccessService;
import com.website.personaltrainer.Util.AuthorityUtil;
import com.website.personaltrainer.enums.AuthorityEnums;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/success-story")
public class SuccessController {

    private final SuccessService successService;

    @Autowired
    public SuccessController(SuccessService successService) {
        this.successService = successService;
    }

    // Create a success story (requires admin role)
    @PostMapping("/create")
    public ResponseEntity<?> createSuccessStory(@AuthenticationPrincipal User user, @RequestBody SuccessStory successStory) {
        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), user)) {
            try {
                SuccessStory savedStory = successService.save(successStory);
                return ResponseEntity.ok(savedStory);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }

    // Get all success stories
    @GetMapping("/all")
    public ResponseEntity<?> getAllSuccessStories() {
        List<SuccessStory> successStories = successService.getAllSuccessStories();
        return ResponseEntity.ok(successStories);
    }

    // Get all enabled success stories
    @GetMapping("/all/enabled")
    public ResponseEntity<?> getAllEnabledSuccessStories() {
        List<SuccessStory> successStories = successService.getAllEnabledSuccessStories();
        return ResponseEntity.ok(successStories);
    }

    // Delete a success story
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSuccessStory(@PathVariable Long id) {
        try {
            successService.deleteSuccessStory(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update a success story (requires admin role)
    @PutMapping("")
    public ResponseEntity<?> updateSuccessStory(@AuthenticationPrincipal User user, @RequestBody SuccessStory updatedStory, @RequestParam Long storyId) {
        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), user)) {
            try {
                SuccessStory updatedSavedStory = successService.update(updatedStory, storyId);
                return ResponseEntity.ok((updatedSavedStory));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }

    // Enable a list of success stories (requires admin role)
    @PutMapping("/enable")
    public ResponseEntity<?> enableStories(@AuthenticationPrincipal User user, @RequestBody List<Long> storyIds) {
        if (AuthorityUtil hasRole(AuthorityEnums.ROLE_ADMIN.name(), user)) {
            try {
                List<Long> enabledIds = successService.enableIds(storyIds);
                return ResponseEntity.ok(enabledIds);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }

    // Disable a list of success stories (requires admin role)
    @PutMapping("/disable")
    public ResponseEntity<?> disableStories(@AuthenticationPrincipal User user, @RequestBody List<Long> storyIds) {
        if (AuthorityUtil.hasRole(AuthorityEnums.ROLE_ADMIN.name(), user)) {
            try {
                List<Long> disabledIds = successService.disableIds(storyIds);
                return ResponseEntity.ok(disabledIds);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
    }

    // Search for success stories by name
    @GetMapping("/searchStories")
    public ResponseEntity<List<SuccessStory>> searchSuccessStories(
            @RequestParam("searchValue") String searchValue) {

        List<SuccessStory> matchingStories = successService.searchByName(searchValue);

        return ResponseEntity.ok(matchingStories);
    }
}
