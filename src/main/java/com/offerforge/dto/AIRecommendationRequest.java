package com.offerforge.dto;

import lombok.Data;

@Data
public class AIRecommendationRequest {

    private String message;

    private String fullName;

    private String branch;

    private String college;

    private Integer graduationYear;

    private String skills;

    private String location;

    private String resumeText;
}