package com.offerforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AtsResponse {

    private int matchScore;

    private List<String> matchedSkills;

    private List<String> missingSkills;

    private List<String> suggestions;
}