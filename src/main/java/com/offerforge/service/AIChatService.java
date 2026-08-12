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

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    public ChatResponse chat(String message) {
        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                        + apiKey;

        String prompt = """
                You are OfferForge AI Career Coach, an intelligent assistant for
                software engineering students and job seekers.

                Your expertise includes:
                - ATS Resume Optimization
                - Resume Review
                - Interview Preparation
                - DSA and System Design Guidance
                - Java, Spring Boot, React, Python, SQL, Docker, AWS, Git
                - Career Roadmaps
                - Internship and Placement Preparation
                - Project Recommendations

                Instructions:
                - Answer in under 150 words unless a detailed explanation is requested.
                - Use short bullet points.
                - Give actionable suggestions instead of generic advice.
                - Mention modern tools and industry best practices when relevant.
                - If improving a resume, focus on ATS keywords, measurable impact,
                  technical skills, and projects.
                - If recommending projects, suggest real-world, portfolio-worthy ideas.
                - If asked coding questions, explain the concept first and then provide
                  code if needed.
                - Stay professional, encouraging, and concise.
                - Politely refuse requests unrelated to careers, learning,
                  or software engineering.

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
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        try {

            ResponseEntity<Map> response =
                    restTemplate.exchange(
                            GEMINI_URL,
                            HttpMethod.POST,
                            entity,
                            Map.class
                    );

            Map responseBody = response.getBody();

            if (responseBody == null) {
                return new ChatResponse(
                        "No response received from Gemini."
                );
            }

            List candidates =
                    (List) responseBody.get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                return new ChatResponse(
                        "Gemini did not return a response."
                );
            }

            Map candidate =
                    (Map) candidates.get(0);

            Map content =
                    (Map) candidate.get("content");

            List parts =
                    (List) content.get("parts");

            Map answer =
                    (Map) parts.get(0);

            String answerText =
                    answer.get("text").toString();

            return new ChatResponse(answerText);

        } catch (Exception e) {

            e.printStackTrace();

            return new ChatResponse(
                    "Unable to connect to the AI Career Coach right now."
            );
        }
    }


    public List<String> generateCareerTips() {

        String prompt = """
                You are OfferForge AI Career Coach.

                Generate exactly 5 useful career tips for a software engineering
                student or job seeker.

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