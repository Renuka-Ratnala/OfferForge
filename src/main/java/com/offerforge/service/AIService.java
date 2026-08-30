package com.offerforge.service;

import com.offerforge.dto.AIRecommendationRequest;
import com.offerforge.dto.AIRecommendationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AIService {

    private final RestClient restClient;

    public AIService(
            @Value("${ai.service.url}") String aiServiceUrl
    ) {

        this.restClient = RestClient.builder()
                .baseUrl(aiServiceUrl)
                .build();
    }

    public AIRecommendationResponse getRecommendations(
            AIRecommendationRequest request
    ) {

        return restClient.post()
                .uri("/ai/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(AIRecommendationResponse.class);
    }
}