package com.website.personaltrainer.Service;

import com.website.personaltrainer.Model.SuccessStory;
import com.website.personaltrainer.Repository.SuccessRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class SuccessService {

    private final SuccessRepo successRepo;

    @Autowired
    public SuccessService(SuccessRepo successRepo) {
        this.successRepo = successRepo;
    }

    public SuccessStory save(SuccessStory successStory) {
        successStory.setEnabled(false);
        return successRepo.save(successStory);
    }

    public List<SuccessStory> getAllSuccessStories() {
        List<SuccessStory> stories = successRepo.findAll();
        return stories;
    }

    public List<SuccessStory> getAllEnabledSuccessStories() {
        List<SuccessStory> enabledStories = successRepo.findAllByEnabled();
        return enabledStories;
    }

    public void deleteSuccessStory(Long id) {
        successRepo.deleteById(id);
    }

    public SuccessStory update(SuccessStory updatedStory, Long storyId) {
        Optional<SuccessStory> storyOpt = successRepo.findById(storyId);
        if (storyOpt.isPresent()) {
            SuccessStory story = storyOpt.get();
            story.setStory(updatedStory.getStory());
            story.setName(updatedStory.getName());
            story.setMonth(updatedStory.getMonth());
            story.setYear(updatedStory.getYear());
            return successRepo.save(story);
        } else {
            throw new NoSuchElementException("Story not found with userId: " + storyId);
        }
    }

    public List<Long> enableIds(List<Long> storyIds) {
        List<Long> updatedIds = new ArrayList<>();

        for (Long storyId : storyIds) {
            Optional<SuccessStory> storyOptional = successRepo.findById(storyId);

            if (storyOptional.isPresent()) {
                SuccessStory story = storyOptional.get();
                story.setEnabled(true);
                successRepo.save(story);
                updatedIds.add(storyId);
            }
        }
        return updatedIds;
    }

    public List<Long> disableIds(List<Long> storyIds) {

        List<Long> updatedIds = new ArrayList<>();
        for (Long storyId : storyIds) {
            Optional<SuccessStory> storyOptional = successRepo.findById(storyId);

            if (storyOptional.isPresent()) {
                SuccessStory story = storyOptional.get();
                story.setEnabled(false);
                successRepo.save(story);
                updatedIds.add(storyId);
            }
        }
        return updatedIds;
    }


    public List<SuccessStory> searchByName(String searchValue) {
        return successRepo.searchByName(searchValue);
    }
}
