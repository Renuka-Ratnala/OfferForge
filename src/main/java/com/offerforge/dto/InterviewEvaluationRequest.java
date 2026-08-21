package com.offerforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewEvaluationRequest {

    private String question;

    private String answer;

    private String role;

    private String type;

    private String difficulty;
}