package com.offerforge.dto;

import lombok.Data;

import java.util.List;

@Data
public class DashboardResponse {

    private Integer atsScore;

    private Boolean resumeUploaded;

    private Integer jobMatches;

    private Integer profileCompletion;

    private ProfileResponse profile;

    private List<String> recentActivities;

    private List<String> aiTips;
}