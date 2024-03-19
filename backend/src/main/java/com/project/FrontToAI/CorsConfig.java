package com.project.FrontToAI;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/*")
                .allowedOrigins("http://ec2-15-164-103-125.ap-northeast-2.compute.amazonaws.com:3000") // 리액트 애플리케이션의 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("");
    }
}