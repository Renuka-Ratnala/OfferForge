package com.offerforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumeHealthResponse {

    private boolean contactInfo;

    private boolean education;

    private boolean technicalSkills;

    private boolean projects;

    private boolean achievements;

    private boolean certifications;

    private boolean github;

}