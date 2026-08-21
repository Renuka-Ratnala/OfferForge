package com.offerforge.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.offerforge.dto.InterviewEvaluationResponse;
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

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AIInterviewService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    // =========================================================
    // GENERATE INTERVIEW QUESTION
    // =========================================================

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


    // =========================================================
    // EVALUATE INTERVIEW ANSWER
    // =========================================================

    public InterviewEvaluationResponse evaluateAnswer(
            String question,
            String answer,
            String role,
            String type,
            String difficulty
    ) {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key="
                        + apiKey;


        String prompt = """
                You are OfferForge AI Interview Evaluator.

                Evaluate the candidate's interview answer.

                Candidate role: %s
                Interview type: %s
                Difficulty: %s

                Interview question:
                %s

                Candidate answer:
                %s

                Evaluate the answer based on:
                1. Technical correctness and relevance
                2. Communication clarity
                3. Confidence demonstrated through the answer
                4. Completeness and structure

                Give scores from 0 to 100.

                Rules:
                - score = overall interview answer score
                - confidence = confidence demonstrated in the response
                - communication = clarity and organization
                - technicalAccuracy = correctness and relevance
                - feedback = concise useful feedback
                - strengths = 2 or 3 specific strengths
                - improvements = 2 or 3 specific improvements
                - Do not invent facts about the candidate.
                - Be fair and constructive.
                - Return ONLY valid JSON.
                - Do not use markdown.
                - Do not wrap the JSON in ```.

                Required JSON format:

                {
                  "score": 0,
                  "confidence": 0,
                  "communication": 0,
                  "technicalAccuracy": 0,
                  "feedback": "string",
                  "strengths": ["string", "string"],
                  "improvements": ["string", "string"]
                }
                """.formatted(
                role,
                type,
                difficulty,
                question,
                answer
        );


        // Text part

        Map<String, Object> text = new HashMap<>();
        text.put("text", prompt);


        // Content

        Map<String, Object> part = new HashMap<>();
        part.put(
                "parts",
                List.of(text)
        );


        // Generation configuration

        Map<String, Object> generationConfig =
                new HashMap<>();

        generationConfig.put(
                "responseMimeType",
                "application/json"
        );


        // Request body

        Map<String, Object> body =
                new HashMap<>();

        body.put(
                "contents",
                List.of(part)
        );

        body.put(
                "generationConfig",
                generationConfig
        );


        // Headers

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );


        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(
                        body,
                        headers
                );


        // Gemini request

        Map response =
                restTemplate.postForObject(
                        url,
                        entity,
                        Map.class
                );


        // Extract Gemini response

        List candidates =
                (List) response.get(
                        "candidates"
                );

        Map candidate =
                (Map) candidates.get(0);

        Map content =
                (Map) candidate.get(
                        "content"
                );

        List parts =
                (List) content.get(
                        "parts"
                );

        Map result =
                (Map) parts.get(0);

        String json =
                result.get(
                                "text"
                        )
                        .toString()
                        .trim();


        // Convert JSON into our response DTO

        try {

            return objectMapper.readValue(
                    json,
                    InterviewEvaluationResponse.class
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse Gemini evaluation response: "
                            + json,
                    e
            );
        }
    }

}