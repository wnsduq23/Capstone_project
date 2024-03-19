package com.project.Community.post;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Collections;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.Community.comment.Community_comment;

import org.springframework.beans.factory.annotation.Autowired;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://ec2-13-124-121-82.ap-northeast-2.compute.amazonaws.com:8080")
@RestController
public class Community_postController {

    private final Community_postService Community_postService;

    public String encodeBcrypt(String planeText, int strength) {
        return new BCryptPasswordEncoder(strength).encode(planeText);
    }
    public boolean matchesBcrypt(String planeText, String hashValue, int strength) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(strength);
        return passwordEncoder.matches(planeText, hashValue);
    }

    @GetMapping("/community_post/list")
    public List<Map<String, Object>> list() {
        List<Community_post> community_postList = this.Community_postService.getList();
        Collections.reverse(community_postList);
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (Community_post post : community_postList) {
            Map<String, Object> postMap = new HashMap<>();
            postMap.put("id", post.getId());
            postMap.put("subject", post.getSubject());
            postMap.put("createDate", post.getCreateDate());
            resultList.add(postMap);
        }
        return (resultList);
    }
 
    @GetMapping(value = "/community_post/detail")
    public Map<String, Object> detail(@RequestParam("id") Integer id) {
        Community_post Community_post = this.Community_postService.getCommunity_post(id);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("subject", Community_post.getSubject());
        resultMap.put("content", Community_post.getContent());
        resultMap.put("createDate", Community_post.getCreateDate());
        resultMap.put("modifyDate", Community_post.getModifyDate());
        return (resultMap) ;
    }

    @GetMapping("/community_post/detail_comment")
    public List<Map<String, Object>> comment_list(@RequestParam("id") Integer id) {
        Community_post Community_post = this.Community_postService.getCommunity_post(id);
        List<Community_comment> commentList = Community_post.getCommentList();
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (Community_comment comment : commentList){
            Map<String, Object> commentInfo = new HashMap<>();
            commentInfo.put("content", comment.getContent());
            commentInfo.put("createDate", comment.getCreateDate());
            resultList.add(commentInfo);
        }
        return (resultList);
    }

    /*@GetMapping("/community_post/create")
    public String Community_postCreate() {
        return "community_post_form";
    }*/

    @PostMapping("/community_post/create")
    public ResponseEntity<String> Community_postCreate(@RequestPart("subject") String subject, @RequestPart("content") String content, @RequestPart("password") String password) {
        System.out.println("여기입니다");
        String encodepassword = this.encodeBcrypt(password, 10);
        this.Community_postService.create(subject, content, encodepassword);
        return ResponseEntity.ok("Success");
    }

    @GetMapping("/community_post/edit")
    public Map<String, Object> Community_postEdit(@RequestParam("id") Integer id) {
        Community_post existingPost = Community_postService.getCommunity_post(id);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("subject", existingPost.getSubject());
        resultMap.put("content", existingPost.getContent());
        return (resultMap);
    }

    @PostMapping("/community_post/edit")
    public ResponseEntity<String> Community_postEdit(@RequestParam("id") Integer id, @RequestPart("password") String password, @RequestPart ("subject") String subject, @RequestPart("content") String content) {
        Community_post existingPost = Community_postService.getCommunity_post(id);
        if (existingPost != null) {
        if (this.matchesBcrypt(password, existingPost.getPassword(), 10)) {
            this.Community_postService.modify(existingPost, subject, content);
            return ResponseEntity.ok("Success");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request");
        }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request");
        }
    }

    @PostMapping("/community_post/delete")
    public ResponseEntity<String> Community_postDelete(@RequestParam("id") Integer id, @RequestPart("password") String password) {
        System.out.println(password);
        Community_post existingPost = Community_postService.getCommunity_post(id);
        if (existingPost != null) {
            if (this.matchesBcrypt(password, existingPost.getPassword(), 10)) {
                this.Community_postService.delete(existingPost);
                return ResponseEntity.ok("Success");
        }   else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request");
            }   
        }else {
        return ResponseEntity.ok("Success");
        }
    }

    @PostMapping("/community_post/search")
    public List<Map<String, Object>> searchPost(@RequestPart("keyword") String keyword, @RequestPart("searchOption") String searchOption) {
        List<Community_post> community_postList;

        System.out.println("여기까지");

        if ("title".equals(searchOption)) {
            community_postList = this.Community_postService.searchSubject(keyword);
        } else if ("titleAndContent".equals(searchOption)) {
            community_postList = this.Community_postService.search(keyword);
        } else {
            community_postList = this.Community_postService.searchSubject(keyword);
        }

        List<Map<String, Object>> resultList = new ArrayList<>();
        for (Community_post post : community_postList) {
            Map<String, Object> postMap = new HashMap<>();
            postMap.put("id", post.getId());
            postMap.put("subject", post.getSubject());
            postMap.put("createDate", post.getCreateDate());
            resultList.add(postMap);
        }
        return (resultList);
    }
}
