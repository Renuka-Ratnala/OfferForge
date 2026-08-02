package com.offerforge.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;

    private String location;

    private String college;

    private String branch;

    private Integer graduationYear;

    private String skills;

    private String linkedinUrl;

    private String githubUrl;
}