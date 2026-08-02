package com.offerforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobRecommendationResponse {

    private Long jobId;

    private String jobTitle;

    private String companyName;

    private int matchScore;
}