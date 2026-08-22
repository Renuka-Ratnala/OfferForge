package com.offerforge.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterviewStartRequest {

    private String role;
    private String type;
    private String difficulty;
    private int questionNumber;
}