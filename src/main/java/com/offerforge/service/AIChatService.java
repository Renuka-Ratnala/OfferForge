package com.offerforge.service;

import com.offerforge.dto.AtsResponse;
import com.offerforge.dto.ChatResponse;
import com.offerforge.dto.JobRecommendationResponse;
import com.offerforge.dto.ProfileResponse;
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

    @Autowired
    private UserService userService;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    public ChatResponse chat(String message) {

        String profileContext =
                buildProfileContext();

        String url =
                GEMINI_URL +
                        "?key=" +
                        apiKey;

        String prompt = """
                You are OfferForge AI Career Coach.

                You are helping a software engineering student or job seeker.

                IMPORTANT:
                Use the candidate's actual OfferForge information below
                when giving personalized advice.

                Candidate information:
                %s

                Your expertise includes:
                - ATS Resume Optimization
                - Resume Review
                - Interview Preparation
                - DSA
                - System Design
                - Java
                - Spring Boot
                - React
                - Python
                - SQL
                - Docker
                - AWS
                - Git
                - Career Roadmaps
                - Internship Preparation
                - Placement Preparation
                - Project Recommendations

                Instructions:
                - Give practical and actionable advice.
                - Keep responses under 200 words unless detailed explanation is requested.
                - Use short paragraphs or bullet points.
                - Do not invent candidate information.
                - If information is missing, clearly say that it is missing.
                - When discussing the resume, use the actual ATS score when available.
                - When discussing jobs, consider the candidate's actual skills.
                - When discussing career improvement, prioritize the biggest gaps first.
                - Avoid generic motivational advice.
                - Stay professional and encouraging.
                - Politely refuse requests unrelated to careers,
                  learning, or software engineering.

                User Question:
                %s
                """.formatted(
                profileContext,
                message
        );

        Map<String, Object> text =
                new HashMap<>();

        text.put(
                "text",
                prompt
        );

        Map<String, Object> part =
                new HashMap<>();

        part.put(
                "parts",
                List.of(text)
        );

        Map<String, Object> body =
                new HashMap<>();

        body.put(
                "contents",
                List.of(part)
        );

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        headers.set(
                "x-goog-api-key",
                apiKey
        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(
                        body,
                        headers
                );

        try {

            ResponseEntity<Map> response =
                    restTemplate.exchange(
                            GEMINI_URL,
                            HttpMethod.POST,
                            entity,
                            Map.class
                    );

            Map responseBody =
                    response.getBody();

            if (responseBody == null) {

                return new ChatResponse(
                        "No response received from Gemini."
                );

            }

            List candidates =
                    (List) responseBody.get(
                            "candidates"
                    );

            if (
                    candidates == null ||
                            candidates.isEmpty()
            ) {

                return new ChatResponse(
                        "Gemini did not return a response."
                );

            }

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

            Map answer =
                    (Map) parts.get(0);

            String answerText =
                    answer.get(
                                    "text"
                            )
                            .toString()
                            .trim();

            return new ChatResponse(
                    answerText
            );

        } catch (Exception e) {

            e.printStackTrace();

            return new ChatResponse(
                    "Unable to connect to the AI Career Coach right now."
            );

        }
    }


    private String buildProfileContext() {

        StringBuilder context =
                new StringBuilder();

        try {

            ProfileResponse profile =
                    userService.getProfile();

            context.append(
                    "Name: "
            );

            context.append(
                    valueOrUnknown(
                            profile.getFullName()
                    )
            );

            context.append(
                    "\nEmail: "
            );

            context.append(
                    valueOrUnknown(
                            profile.getEmail()
                    )
            );

            context.append(
                    "\nCollege: "
            );

            context.append(
                    valueOrUnknown(
                            profile.getCollege()
                    )
            );

            context.append(
                    "\nBranch: "
            );

            context.append(
                    valueOrUnknown(
                            profile.getBranch()
                    )
            );

            context.append(
                    "\nGraduation Year: "
            );

            context.append(
                    profile.getGraduationYear() != null
                            ? profile.getGraduationYear()
                            : "Not provided"
            );

            context.append(
                    "\nSkills: "
            );

            context.append(
                    valueOrUnknown(
                            profile.getSkills()
                    )
            );

            context.append(
                    "\nLinkedIn: "
            );

            context.append(
                    valueOrUnknown(
                            profile.getLinkedinUrl()
                    )
            );

            context.append(
                    "\nGitHub: "
            );

            context.append(
                    valueOrUnknown(
                            profile.getGithubUrl()
                    )
            );

            boolean resumeUploaded =
                    profile.getResumeUrl() != null &&
                            !profile.getResumeUrl()
                                    .trim()
                                    .isEmpty();

            context.append(
                    "\nResume Uploaded: "
            );

            context.append(
                    resumeUploaded
            );


            if (resumeUploaded) {

                try {

                    AtsResponse ats =
                            userService.analyzeResume();

                    context.append(
                            "\nATS Score: "
                    );

                    context.append(
                            ats.getMatchScore()
                    );

                    context.append(
                            "%"
                    );

                    if (
                            ats.getSuggestions() != null &&
                                    !ats.getSuggestions().isEmpty()
                    ) {

                        context.append(
                                "\nResume Suggestions: "
                        );

                        context.append(
                                String.join(
                                        "; ",
                                        ats.getSuggestions()
                                )
                        );
                    }

                } catch (Exception e) {

                    context.append(
                            "\nATS Score: Unable to calculate"
                    );

                }


                try {

                    List<JobRecommendationResponse>
                            jobs =
                            userService.recommendJobs();

                    context.append(
                            "\nMatching Jobs: "
                    );

                    context.append(
                            jobs.size()
                    );

                } catch (Exception e) {

                    context.append(
                            "\nMatching Jobs: Unable to calculate"
                    );

                }

            }

        } catch (Exception e) {

            context.append(
                    "Profile information is currently unavailable."
            );

        }

        return context.toString();
    }


    private String valueOrUnknown(
            String value
    ) {

        if (
                value == null ||
                        value.trim().isEmpty()
        ) {

            return "Not provided";

        }

        return value;

    }


    public List<String> generateCareerTips() {

        String profileContext =
                buildProfileContext();

        String prompt = """
                You are OfferForge AI Career Coach.

                Candidate information:
                %s

                Generate exactly 5 personalized career tips.

                Rules:
                - One tip per line.
                - No numbering.
                - No markdown.
                - Keep each tip under 25 words.
                - Base the tips on the candidate information.
                - Prioritize resume, ATS, internships,
                  software engineering skills and interview preparation.
                - Do not invent information.
                """.formatted(
                profileContext
        );

        ChatResponse chatResponse =
                chat(prompt);

        String response =
                chatResponse.getResponse();

        return Arrays.stream(
                        response.split("\\n")
                )
                .map(String::trim)
                .filter(
                        s -> !s.isEmpty()
                )
                .limit(5)
                .toList();
    }
}