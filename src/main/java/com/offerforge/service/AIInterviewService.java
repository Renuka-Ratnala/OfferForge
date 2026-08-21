package com.offerforge.service;

import com.offerforge.dto.InterviewQuestionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIInterviewService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public AIInterviewService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public InterviewQuestionResponse generateQuestion(
            String role,
            String type,
            String difficulty
    ) {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key="
                        + apiKey;

        String prompt = """
                You are OfferForge AI Interviewer.

                Generate ONE interview question.

                Candidate role: %s
                Interview type: %s
                Difficulty: %s

                Rules:
                - Generate exactly one question.
                - Make it realistic for a software engineering interview.
                - Match the selected role.
                - Match the interview type.
                - Match the difficulty.
                - Do not give the answer.
                - Do not add explanations.
                - Return only the interview question.
                """.formatted(
                role,
                type,
                difficulty
        );

        Map<String, Object> text = new HashMap<>();
        text.put("text", prompt);

        Map<String, Object> part = new HashMap<>();
        part.put("parts", List.of(text));

        Map<String, Object> body = new HashMap<>();
        body.put("contents", List.of(part));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        Map response =
                restTemplate.postForObject(
                        url,
                        entity,
                        Map.class
                );

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

        String question =
                answer.get("text").toString().trim();

        return new InterviewQuestionResponse(
                question,
                type
        );
    }
}