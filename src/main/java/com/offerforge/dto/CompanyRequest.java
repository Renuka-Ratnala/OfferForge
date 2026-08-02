package com.offerforge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 100, message = "Company name cannot exceed 100 characters")
    private String companyName;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Website is required")
    private String website;

    @NotBlank(message = "Industry is required")
    private String industry;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
}