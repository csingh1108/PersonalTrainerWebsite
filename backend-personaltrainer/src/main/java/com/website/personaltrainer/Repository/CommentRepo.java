package com.website.personaltrainer.Repository;

import com.website.personaltrainer.Model.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepo extends JpaRepository <Comments, Long> {
}
