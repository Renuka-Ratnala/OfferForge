package com.offerforge.entity;

import jakarta.persistence.*;
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

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}