package com.offerforge.controller;

import com.offerforge.dto.AIRecommendationRequest;
import com.offerforge.dto.AIRecommendationResponse;
import com.offerforge.dto.ProfileResponse;
import com.offerforge.service.AIService;
import com.offerforge.service.UserService;
import com.offerforge.util.ResumeTextExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @Autowired
    private UserService userService;

    @Autowired
    private ResumeTextExtractor resumeTextExtractor;


    @PostMapping("/recommend")
    public AIRecommendationResponse recommend(
            @RequestBody(required = false)
            AIRecommendationRequest request
    ) throws IOException {

        ProfileResponse profile =
                userService.getProfile();

        String resumeText = "";

        if (profile.getResumeUrl() != null &&
                !profile.getResumeUrl().trim().isEmpty()) {

            try {

                resumeText =
                        resumeTextExtractor.extractText(
                                profile.getResumeUrl()
                        );

            } catch (IOException e) {

                System.out.println(
                        "Unable to extract resume text: "
                                + e.getMessage()
                );
            }
        }

        AIRecommendationRequest aiRequest =
                new AIRecommendationRequest();

        aiRequest.setMessage(
                request != null &&
                        request.getMessage() != null
                        ? request.getMessage()
                        : "Find the best jobs for my profile."
        );

        aiRequest.setFullName(
                profile.getFullName()
        );

        aiRequest.setBranch(
                profile.getBranch()
        );

        aiRequest.setCollege(
                profile.getCollege()
        );

        aiRequest.setGraduationYear(
                profile.getGraduationYear()
        );

        aiRequest.setSkills(
                profile.getSkills()
        );

        aiRequest.setLocation(
                profile.getLocation()
        );

        aiRequest.setResumeText(
                resumeText
        );

        return aiService.getRecommendations(
                aiRequest
        );
    }
}