package com.website.personaltrainer.Repository;

import com.website.personaltrainer.Model.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthoritiesRepo extends JpaRepository<Authority, Long> {
}
