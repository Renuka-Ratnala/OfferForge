package com.offerforge.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class AIJobRecommendation {

    @JsonProperty("job_id")
    private Long jobId;

    @JsonProperty("job_title")
    private String jobTitle;

    @JsonProperty("company_name")
    private String companyName;

    private String location;

    @JsonProperty("job_type")
    private String jobType;

    private Double salary;

    private String description;

    @JsonProperty("required_skills")
    private String requiredSkills;

    @JsonProperty("external_url")
    private String externalUrl;

    @JsonProperty("match_score")
    private Integer matchScore;

    @JsonProperty("matched_skills")
    private List<String> matchedSkills;

    @JsonProperty("missing_skills")
    private List<String> missingSkills;

    @JsonProperty("ai_recommendation")
    private String aiRecommendation;

    @JsonProperty("interview_chance")
    private String interviewChance;

    private String reason;
}