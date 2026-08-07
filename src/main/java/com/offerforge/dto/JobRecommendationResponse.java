package com.offerforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobRecommendationResponse {

    private Long jobId;

    private String jobTitle;

    private String companyName;

    private String location;

    private String jobType;

    private Double salary;

    private String description;

    private String requiredSkills;

    private int matchScore;

    private List<String> matchedSkills;

    private List<String> missingSkills;

    private String aiRecommendation;

    private String interviewChance;

}