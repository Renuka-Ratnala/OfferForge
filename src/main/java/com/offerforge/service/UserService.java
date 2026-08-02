package com.offerforge.service;

import com.offerforge.dto.*;
import com.offerforge.entity.Job;
import com.offerforge.entity.User;
import com.offerforge.repository.UserRepository;
import com.offerforge.repository.JobRepository;
import com.offerforge.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private ResumeAnalyzerService resumeAnalyzerService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }
    public String login(LoginRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return "User not found";
        }

        User user = optionalUser.get();

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return "Login Successful";
        }

        return "Invalid Password";
    }
    @Autowired
    private JwtUtil jwtUtil;
    public String login(String email, String password) {

        System.out.println("Login email = " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("User found = " + user.getEmail());

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        System.out.println("Password matched");

        return jwtUtil.generateToken(user.getEmail());
    }
    public ProfileResponse getProfile() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new ProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getLocation(),
                user.getCollege(),
                user.getBranch(),
                user.getGraduationYear(),
                user.getSkills(),
                user.getLinkedinUrl(),
                user.getGithubUrl(),
                user.getResumeUrl()
        );
    }
    public ProfileResponse updateProfile(ProfileRequest request) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setLocation(request.getLocation());
        user.setCollege(request.getCollege());
        user.setBranch(request.getBranch());
        user.setGraduationYear(request.getGraduationYear());
        user.setSkills(request.getSkills());
        user.setLinkedinUrl(request.getLinkedinUrl());
        user.setGithubUrl(request.getGithubUrl());

        User updatedUser = userRepository.save(user);

        return new ProfileResponse(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getFullName(),
                updatedUser.getPhone(),
                updatedUser.getLocation(),
                updatedUser.getCollege(),
                updatedUser.getBranch(),
                updatedUser.getGraduationYear(),
                updatedUser.getSkills(),
                updatedUser.getLinkedinUrl(),
                updatedUser.getGithubUrl(),
                updatedUser.getResumeUrl()
        );
    }
    public ProfileResponse uploadResume(MultipartFile file) throws IOException {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        System.out.println("Email from JWT = " + email);

        for (User u : userRepository.findAll()) {
            System.out.println("Database Email = " + u.getEmail());
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String uploadDir = "uploads";

        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = user.getId() + "_" + file.getOriginalFilename();

        Path filePath = Paths.get(uploadDir, fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        user.setResumeUrl(filePath.toString());

        User updatedUser = userRepository.save(user);

        return new ProfileResponse(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getFullName(),
                updatedUser.getPhone(),
                updatedUser.getLocation(),
                updatedUser.getCollege(),
                updatedUser.getBranch(),
                updatedUser.getGraduationYear(),
                updatedUser.getSkills(),
                updatedUser.getLinkedinUrl(),
                updatedUser.getGithubUrl(),
                updatedUser.getResumeUrl()
        );
    }
    public AtsResponse analyzeResume(Long jobId) throws IOException {

        // Get logged-in user
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        String jobDescription = job.getDescription().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String resumeText = resumeAnalyzerService.extractText(user.getResumeUrl());
        List<String> skills = Arrays.stream(job.getRequiredSkills().split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .toList();
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();

        String resumeLower = resumeText.toLowerCase();

        String[] requiredSkills = job.getRequiredSkills().split(",");

        for (String skill : requiredSkills) {

            skill = skill.trim().toLowerCase();

            if (resumeLower.contains(skill)) {
                matchedSkills.add(skill);
            } else {
                missingSkills.add(skill);
            }
        }

        int totalRequiredSkills = requiredSkills.length;

        int score = 0;

        if (totalRequiredSkills > 0) {
            score = (matchedSkills.size() * 100) / totalRequiredSkills;
        }
        for (String skill : missingSkills) {

            switch (skill) {

                case "docker":
                    suggestions.add("Add Docker projects to your resume.");
                    break;

                case "aws":
                    suggestions.add("Gain hands-on AWS cloud experience.");
                    break;

                case "git":
                    suggestions.add("Mention Git and GitHub collaboration.");
                    break;

                case "mysql":
                    suggestions.add("Highlight MySQL database experience.");
                    break;

                default:
                    suggestions.add("Improve your " + skill + " skills.");
            }
        }
        System.out.println("==========================");
        System.out.println(resumeText);
        System.out.println("==========================");

        return new AtsResponse(
                score,
                matchedSkills,
                missingSkills,
                suggestions
        );

    }
    public List<JobRecommendationResponse> recommendJobs() throws IOException {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String resumeText = resumeAnalyzerService.extractText(user.getResumeUrl())
                .toLowerCase();

        List<Job> jobs = jobRepository.findAll();

        List<JobRecommendationResponse> recommendations = new ArrayList<>();

        for (Job job : jobs) {

            String[] requiredSkills = job.getRequiredSkills().toLowerCase().split(",");

            int matched = 0;

            for (String skill : requiredSkills) {

                if (resumeText.contains(skill.trim())) {
                    matched++;
                }
            }

            int score = (matched * 100) / requiredSkills.length;

            recommendations.add(
                    new JobRecommendationResponse(
                            job.getId(),
                            job.getJobTitle(),
                            job.getCompany().getCompanyName(),
                            score
                    )
            );
        }

        recommendations.sort((a, b) ->
                Integer.compare(b.getMatchScore(), a.getMatchScore()));

        return recommendations;
    }


}