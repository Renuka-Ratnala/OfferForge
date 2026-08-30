package com.offerforge.dto;

import lombok.Data;

import java.util.List;

@Data
public class AIRecommendationResponse {

    private String response;

    private List<AIJobRecommendation> recommendations;
}