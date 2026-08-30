package com.offerforge.dto;

import lombok.Data;

import java.util.List;

@Data
public class AIJobRecommendation {

    private Long jobId;

    private String jobTitle;

    private String companyName;

    private String location;

    private String jobType;

    private Double salary;

    private String description;

    private String requiredSkills;

    private Integer matchScore;

    private List<String> matchedSkills;

    private List<String> missingSkills;

    private String aiRecommendation;

    private String interviewChance;

    private String reason;
}