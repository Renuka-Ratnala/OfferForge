package com.offerforge.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must contain at least 8 characters")
    private String password;

    private String phone;

    private String location;

    private String college;

    private String branch;

    private Integer graduationYear;

    private String skills;

    private String linkedinUrl;

    private String githubUrl;
}