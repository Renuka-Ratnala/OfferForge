package com.offerforge.service;

import com.offerforge.dto.AtsResponse;
import com.offerforge.dto.DashboardResponse;
import com.offerforge.dto.JobRecommendationResponse;
import com.offerforge.dto.ProfileResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private UserService userService;

    public DashboardResponse getDashboard() {

        DashboardResponse response = new DashboardResponse();

        ProfileResponse profile = userService.getProfile();

        boolean resumeUploaded =
                profile.getResumeUrl() != null &&
                        !profile.getResumeUrl().trim().isEmpty();

        int atsScore = 0;

        if (resumeUploaded) {
            try {

                AtsResponse analysis =
                        userService.analyzeResume();

                atsScore = analysis.getMatchScore();

            } catch (Exception e) {

                System.out.println(
                        "Unable to analyze resume for dashboard: "
                                + e.getMessage()
                );

            }
        }

        int jobMatches = 0;

        if (resumeUploaded) {
            try {

                List<JobRecommendationResponse> recommendations =
                        userService.recommendJobs();

                for (JobRecommendationResponse job : recommendations) {

                    if (job.getMatchScore() >= 60) {
                        jobMatches++;
                    }
                }

            } catch (Exception e) {

                System.out.println(
                        "Unable to calculate job matches: "
                                + e.getMessage()
                );

            }
        }

        int profileCompletion =
                calculateProfileCompletion(profile);

        response.setAtsScore(atsScore);

        response.setResumeUploaded(resumeUploaded);

        response.setJobMatches(jobMatches);

        response.setProfileCompletion(profileCompletion);

        response.setRecentActivities(
                buildRecentActivities(
                        resumeUploaded,
                        atsScore,
                        jobMatches,
                        profileCompletion
                )
        );

        response.setAiTips(
                buildAiTips(
                        profile,
                        resumeUploaded,
                        atsScore
                )
        );

        return response;
    }

    private int calculateProfileCompletion(
            ProfileResponse profile
    ) {

        int completed = 0;
        int total = 11;

        if (isFilled(profile.getFullName())) {
            completed++;
        }

        if (isFilled(profile.getEmail())) {
            completed++;
        }

        if (isFilled(profile.getPhone())) {
            completed++;
        }

        if (isFilled(profile.getLocation())) {
            completed++;
        }

        if (isFilled(profile.getCollege())) {
            completed++;
        }

        if (isFilled(profile.getBranch())) {
            completed++;
        }

        if (profile.getGraduationYear() != null) {
            completed++;
        }

        if (isFilled(profile.getSkills())) {
            completed++;
        }

        if (isFilled(profile.getLinkedinUrl())) {
            completed++;
        }

        if (isFilled(profile.getGithubUrl())) {
            completed++;
        }

        if (isFilled(profile.getResumeUrl())) {
            completed++;
        }

        return (completed * 100) / total;
    }

    private boolean isFilled(String value) {

        return value != null &&
                !value.trim().isEmpty();
    }

    private List<String> buildRecentActivities(
            boolean resumeUploaded,
            int atsScore,
            int jobMatches,
            int profileCompletion
    ) {

        List<String> activities =
                new ArrayList<>();

        if (resumeUploaded) {
            activities.add(
                    "Resume uploaded and analyzed"
            );

            activities.add(
                    "Current ATS score: "
                            + atsScore + "%"
            );
        } else {
            activities.add(
                    "Upload your resume to begin analysis"
            );
        }

        activities.add(
                jobMatches
                        + " jobs currently match your profile"
        );

        activities.add(
                "Profile completion: "
                        + profileCompletion + "%"
        );

        return activities;
    }

    private List<String> buildAiTips(
            ProfileResponse profile,
            boolean resumeUploaded,
            int atsScore
    ) {

        List<String> tips =
                new ArrayList<>();

        if (!resumeUploaded) {

            tips.add(
                    "Upload your resume to get an ATS analysis."
            );

        } else if (atsScore < 60) {

            tips.add(
                    "Improve your resume keywords and project descriptions to increase your ATS score."
            );

        } else if (atsScore < 80) {

            tips.add(
                    "Your resume has a decent ATS score. Add measurable achievements and stronger technical details."
            );

        } else {

            tips.add(
                    "Your ATS score is strong. Focus on tailoring your resume for each target role."
            );
        }

        if (!isFilled(profile.getGithubUrl())) {

            tips.add(
                    "Add your GitHub profile to strengthen your technical presence."
            );
        }

        if (!isFilled(profile.getLinkedinUrl())) {

            tips.add(
                    "Add your LinkedIn profile so recruiters can find you easily."
            );
        }

        if (!isFilled(profile.getSkills())) {

            tips.add(
                    "Add your technical skills to improve job matching."
            );
        }

        return tips;
    }
}