package com.offerforge.service;

import com.offerforge.dto.DashboardResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    public DashboardResponse getDashboard() {

        DashboardResponse response = new DashboardResponse();

        response.setAtsScore(78);

        response.setResumeUploaded(true);

        response.setJobMatches(12);

        response.setProfileCompletion(85);

        response.setRecentActivities(List.of(
                "Resume uploaded",
                "ATS score improved",
                "5 new job matches"
        ));

        response.setAiTips(List.of(
                "Add Docker to your resume.",
                "Improve project descriptions.",
                "Tailor your resume for each application."
        ));

        return response;
    }
}