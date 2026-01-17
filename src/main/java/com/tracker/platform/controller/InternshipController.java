package com.tracker.platform.controller;

import com.tracker.platform.entity.Internship;
import com.tracker.platform.entity.InternshipStatus;
import com.tracker.platform.entity.User;
import com.tracker.platform.repository.InternshipRepository;
import com.tracker.platform.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
public class InternshipController {

    private final InternshipRepository internshipRepository;
    private final UserRepository userRepository;

    public InternshipController(
            InternshipRepository internshipRepository,
            UserRepository userRepository
    ) {
        this.internshipRepository = internshipRepository;
        this.userRepository = userRepository;
    }

    // ✅ POST – Create internship (no user)
    @PostMapping
    public Internship createInternship(@Valid @RequestBody Internship internship) {
        return internshipRepository.save(internship);
    }

    // ✅ POST – Create internship for a specific user
    @PostMapping("/user/{userId}")
    public Internship createInternshipForUser(
            @PathVariable Long userId,
            @Valid @RequestBody Internship internship
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found with id " + userId));

        internship.setUser(user);
        return internshipRepository.save(internship);
    }

    // ✅ GET – Fetch all internships
    @GetMapping
    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

    // ✅ GET – Fetch internships by status
    @GetMapping("/status/{status}")
    public List<Internship> getInternshipsByStatus(
            @PathVariable InternshipStatus status
    ) {
        return internshipRepository.findByStatus(status);
    }

    // ✅ PUT – Update internship status
    @PutMapping("/{id}/status")
    public Internship updateStatus(
            @PathVariable Long id,
            @RequestParam InternshipStatus status
    ) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Internship not found with id " + id));

        internship.setStatus(status);
        return internshipRepository.save(internship);
    }
}