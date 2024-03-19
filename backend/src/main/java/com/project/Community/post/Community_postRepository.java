package com.project.Community.post;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface Community_postRepository extends JpaRepository<Community_post, Integer> {
    List<Community_post> findBySubjectContainingOrContentContaining(String subject, String content);
    List<Community_post> findBySubjectContaining(String subject);
}
