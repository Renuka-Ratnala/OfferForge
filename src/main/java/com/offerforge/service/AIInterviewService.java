package com.offerforge.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.offerforge.dto.InterviewEvaluationResponse;
import com.offerforge.dto.InterviewQuestionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
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
    // GEMINI REQUEST WITH RETRY
    // =========================================================

    private Map callGemini(
            String url,
            Map<String, Object> body
    ) {

        int maxAttempts = 3;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {

            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<Map<String, Object>> entity =
                        new HttpEntity<>(body, headers);

                return restTemplate.postForObject(
                        url,
                        entity,
                        Map.class
                );

            } catch (HttpServerErrorException.ServiceUnavailable e) {

                System.out.println(
                        "Gemini 503 - attempt "
                                + attempt
                                + " of "
                                + maxAttempts
                );

                if (attempt == maxAttempts) {
                    throw e;
                }

                try {
                    Thread.sleep(attempt * 3000L);
                } catch (InterruptedException interruptedException) {

                    Thread.currentThread().interrupt();

                    throw new RuntimeException(
                            "Gemini retry interrupted",
                            interruptedException
                    );
                }
            }
        }

        throw new RuntimeException(
                "Gemini request failed after retries"
        );
    }

    // =========================================================
    // GENERATE INTERVIEW QUESTION
    // =========================================================

    public InterviewQuestionResponse generateQuestion(
            String role,
            String type,
            String difficulty,
            int questionNumber
    ) {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key="
                        + apiKey;

        String prompt = """
                You are OfferForge AI Interviewer conducting a 5-question mock interview.

                Candidate role: %s
                Interview type: %s
                Difficulty: %s
                Current question number: %d of 5

                Generate ONE interview question.

                Rules:
                - Generate exactly one question.
                - This is question %d of a 5-question interview.
                - Make the question different from typical introductory questions when question number is greater than 1.
                - Do not repeat the same question.
                - Match the selected role.
                - Match the interview type.
                - Match the difficulty.
                - Make it realistic for a software engineering interview.
                - Do not give the answer.
                - Do not add explanations.
                - Return only the interview question.

                Question progression:
                Question 1: Fundamental or introductory concept.
                Question 2: Practical application or problem-solving.
                Question 3: Deeper technical reasoning.
                Question 4: Real-world/project scenario.
                Question 5: Challenging final question.

                """.formatted(
                role,
                type,
                difficulty,
                questionNumber,
                questionNumber
        );

        Map<String, Object> text = new HashMap<>();
        text.put("text", prompt);

        Map<String, Object> part = new HashMap<>();
        part.put("parts", List.of(text));

        Map<String, Object> body = new HashMap<>();
        body.put("contents", List.of(part));

        try {

            Map response = callGemini(url, body);

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
                    answer.get("text")
                            .toString()
                            .trim();

            return new InterviewQuestionResponse(
                    question,
                    type
            );

        } catch (Exception e) {

            System.out.println(
                    "Gemini unavailable. Using fallback interview question."
            );

            return new InterviewQuestionResponse(
                    getFallbackQuestion(
                            role,
                            type,
                            difficulty,
                            questionNumber
                    ),
                    type
            );
        }
    }

    // =========================================================
    // FALLBACK INTERVIEW QUESTIONS
    // =========================================================

    private String getFallbackQuestion(
            String role,
            String type,
            String difficulty,
            int questionNumber
    ) {

        String normalizedRole =
                role == null
                        ? ""
                        : role.toLowerCase();

        if (
                normalizedRole.contains("java")
                        || normalizedRole.contains("backend")
                        || normalizedRole.contains("software")
                        || normalizedRole.contains("developer")
        ) {

            switch (questionNumber) {

                case 1:
                    return "What is the difference between an interface and an abstract class in Java, and when would you use each?";

                case 2:
                    return "Suppose your backend API becomes slow when handling many requests. How would you investigate and improve its performance?";

                case 3:
                    return "Explain how a HashMap works internally in Java and what happens when multiple keys produce the same hash.";

                case 4:
                    return "Imagine your Spring Boot application is receiving duplicate requests that create duplicate records in the database. How would you design the application to prevent this?";

                case 5:
                    return "You are designing a production REST API for thousands of users. Explain how you would design its authentication, database access, error handling, and scalability.";

                default:
                    return "Explain a challenging technical problem you solved in one of your projects and how you approached it.";
            }
        }

        if (
                normalizedRole.contains("python")
                        || normalizedRole.contains("data")
                        || normalizedRole.contains("machine learning")
                        || normalizedRole.contains("ai")
        ) {

            switch (questionNumber) {

                case 1:
                    return "What is the difference between a Python list and a tuple, and when would you use each?";

                case 2:
                    return "Suppose a machine learning model performs well on training data but poorly on unseen data. How would you investigate the problem?";

                case 3:
                    return "Explain the bias-variance tradeoff and how it affects machine learning model performance.";

                case 4:
                    return "Imagine you need to deploy a machine learning model as an API used by many users. What factors would you consider when designing the system?";

                case 5:
                    return "Design a machine learning system that continuously receives new data and needs to maintain reliable predictions in production. What components and monitoring would you include?";

                default:
                    return "Describe a challenging technical problem you solved and how you approached it.";
            }
        }

        switch (questionNumber) {

            case 1:
                return "Tell me about your technical background and the technologies you are most comfortable working with.";

            case 2:
                return "Describe a technical problem you encountered in a project and how you solved it.";

            case 3:
                return "How would you debug a software application that is producing incorrect results but no runtime errors?";

            case 4:
                return "Imagine you are responsible for improving an existing application used by many users. How would you identify and prioritize improvements?";

            case 5:
                return "Describe how you would design a reliable software system for a large number of users.";

            default:
                return "Describe a challenging technical problem you solved and what you learned from it.";
        }
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

        Map<String, Object> text = new HashMap<>();
        text.put("text", prompt);

        Map<String, Object> part = new HashMap<>();
        part.put("parts", List.of(text));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put(
                "responseMimeType",
                "application/json"
        );

        Map<String, Object> body = new HashMap<>();
        body.put("contents", List.of(part));
        body.put("generationConfig", generationConfig);

        try {

            Map response = callGemini(url, body);

            List candidates =
                    (List) response.get("candidates");

            Map candidate =
                    (Map) candidates.get(0);

            Map content =
                    (Map) candidate.get("content");

            List parts =
                    (List) content.get("parts");

            Map result =
                    (Map) parts.get(0);

            String json =
                    result.get("text")
                            .toString()
                            .trim();

            return objectMapper.readValue(
                    json,
                    InterviewEvaluationResponse.class
            );

        } catch (Exception e) {

            System.err.println(
                    "========== GEMINI EVALUATION ERROR =========="
            );

            e.printStackTrace();

            System.err.println(
                    "=============================================="
            );

            throw new RuntimeException(
                    "AI interview evaluation is temporarily unavailable. Please try again later.",
                    e
            );
        }
    }
}