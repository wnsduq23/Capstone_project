package com.project.Community.post;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import com.project.Community.DataNotFoundException;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class Community_postService {

    private final Community_postRepository community_postRepository;

    public List<Community_post> getList() {
        return this.community_postRepository.findAll();
    }

    public Community_post getCommunity_post(Integer id) {  
        Optional<Community_post> Community_post = this.community_postRepository.findById(id);
        if (Community_post.isPresent()) {
            return Community_post.get();
        } else {
            throw new DataNotFoundException("post not found");
        }
    }

    public void create(String subject, String content, String password) {
        Community_post q = new Community_post();
        q.setSubject(subject);
        q.setContent(content);
        q.setPassword(password);
        q.setCreateDate(LocalDateTime.now());
        this.community_postRepository.save(q);
    }

    public void modify(Community_post Community_post, String subject, String content) {
        Community_post.setSubject(subject);
        Community_post.setContent(content);
        Community_post.setModifyDate(LocalDateTime.now());
        this.community_postRepository.save(Community_post);
    }

    public void delete(Community_post Community_post) {
        this.community_postRepository.delete(Community_post);
    }

    public List<Community_post> search(String keyword) {//
        return community_postRepository.findBySubjectContainingOrContentContaining(keyword, keyword);
    }

    public List<Community_post> searchSubject(String keyword) {//
        return community_postRepository.findBySubjectContaining(keyword);
    }
}