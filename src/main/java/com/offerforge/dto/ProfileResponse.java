package com.offerforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileResponse {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String location;
    private String college;
    private String branch;
    private Integer graduationYear;
    private String skills;
    private String linkedinUrl;
    private String githubUrl;
    private String resumeUrl;
}