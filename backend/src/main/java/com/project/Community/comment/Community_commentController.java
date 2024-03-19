package com.project.Community.comment;

import com.project.Community.post.Community_post;
import com.project.Community.post.Community_postService;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/community_comment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://ec2-13-124-121-82.ap-northeast-2.compute.amazonaws.com:8080")
@RestController
public class Community_commentController {
    
    private final Community_postService Community_postService;
    private final Community_commentService Community_commentService;

    @PostMapping("/create")
    public void createCommunitycomment(@RequestParam("id") Integer id, @RequestPart("content") String content, @RequestPart("password") String password) {
        Community_post Community_post = this.Community_postService.getCommunity_post(id);
        this.Community_commentService.create(Community_post, content, password);
        System.out.println(content);
        System.out.println(password);
        
    }
}
