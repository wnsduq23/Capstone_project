package com.project.Community.comment;

import com.project.Community.post.Community_post;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class Community_commentService {
     private final Community_commentRepository community_commentRepository;


    public void create(Community_post Community_post, String content, String password) {
        Community_comment Community_comment = new Community_comment();
        Community_comment.setContent(content);
        Community_comment.setCreateDate(LocalDateTime.now());
        Community_comment.setPassword(password);
        Community_comment.setCommunity_post(Community_post);
        this.community_commentRepository.save(Community_comment);
    }


    public Community_post getCommunity_post(Integer id) {
        return null;
    }
}
