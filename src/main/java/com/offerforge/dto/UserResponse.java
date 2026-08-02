package com.offerforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
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