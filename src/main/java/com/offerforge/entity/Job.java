package com.offerforge.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "jobs")
@Data
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String jobTitle;

    private String location;

    private String jobType;

    private Double salary;

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String requiredSkills;

    // ==============================
    // External Job Information
    // ==============================

    @Column(length = 100)
    private String externalId;

    @Column(length = 100)
    private String source;

    @Column(length = 1000)
    private String externalUrl;

    // ==============================
    // Company Relationship
    // ==============================

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}