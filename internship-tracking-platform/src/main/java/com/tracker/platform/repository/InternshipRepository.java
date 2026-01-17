package com.tracker.platform.repository;

import com.tracker.platform.entity.Internship;
import com.tracker.platform.entity.InternshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InternshipRepository extends JpaRepository<Internship, Long> {

    List<Internship> findByStatus(InternshipStatus status);
}