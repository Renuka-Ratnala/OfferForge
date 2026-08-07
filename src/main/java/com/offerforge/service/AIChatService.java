package com.offerforge.service;

import com.offerforge.dto.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIChatService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Autowired
    private RestTemplate restTemplate;

    public ChatResponse chat(String message) {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key="
                        + apiKey;

        String prompt = """
You are OfferForge AI Career Coach, an intelligent assistant for software engineering students and job seekers.

Your expertise includes:
- ATS Resume Optimization
- Resume Review
- Interview Preparation
- DSA & System Design Guidance
- Java, Spring Boot, React, Python, SQL, Docker, AWS, Git
- Career Roadmaps
- Internship & Placement Preparation
- Project Recommendations

Instructions:
- Answer in under 150 words unless a detailed explanation is requested.
- Use short bullet points.
- Give actionable suggestions instead of generic advice.
- Mention modern tools and industry best practices when relevant.
- If improving a resume, focus on ATS keywords, measurable impact, technical skills, and projects.
- If recommending projects, suggest real-world, portfolio-worthy ideas.
- If asked coding questions, explain the concept first and then provide code if needed.
- Stay professional, encouraging, and concise.
- Politely refuse requests unrelated to careers, learning, or software engineering.

User Question:
""" + message;
        Map<String, Object> text = new HashMap<>();
        text.put("text", prompt);

        Map<String, Object> part = new HashMap<>();
        part.put("parts", List.of(text));

        Map<String, Object> body = new HashMap<>();
        body.put("contents", List.of(part));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String,Object>> entity =
                new HttpEntity<>(body, headers);

        Map response =
                restTemplate.postForObject(url, entity, Map.class);

        List candidates =
                (List) response.get("candidates");

        Map candidate =
                (Map) candidates.get(0);

        Map content =
                (Map) candidate.get("content");

        List parts =
                (List) content.get("parts");

        Map answer =
                (Map) parts.get(0);

        return new ChatResponse(
                answer.get("text").toString()
        );
    }
    public List<String> generateCareerTips() {

        String prompt = """
You are OfferForge AI Career Coach.

Generate exactly 5 personalized career tips.

Rules:
- One tip per line.
- No numbering.
- No markdown.
- Keep each tip under 20 words.
- Focus on resume, ATS, internships and software engineering skills.
""";

        ChatResponse chatResponse = chat(prompt);

        String response = chatResponse.getResponse();

        return Arrays.stream(response.split("\\n"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

}