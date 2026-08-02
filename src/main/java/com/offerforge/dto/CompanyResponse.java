package com.offerforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CompanyResponse {

    private Long id;
    private String companyName;
    private String location;
    private String website;
    private String industry;
    private String description;
}