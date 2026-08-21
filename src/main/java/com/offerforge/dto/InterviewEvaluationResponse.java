package com.offerforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewEvaluationResponse {

    private int score;

    private int confidence;

    private int communication;

    private int technicalAccuracy;

    private String feedback;

    private List<String> strengths;

    private List<String> improvements;
}