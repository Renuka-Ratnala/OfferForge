package com.offerforge.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InterviewQuestionResponse {

    private String question;
    private String category;
}