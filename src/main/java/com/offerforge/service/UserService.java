package com.offerforge.service;

import com.offerforge.dto.ProfileResponse;
import com.offerforge.entity.User;
import com.offerforge.repository.UserRepository;
import com.offerforge.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.offerforge.dto.LoginRequest;
import java.util.Optional;
import org.springframework.security.core.context.SecurityContextHolder;
import com.offerforge.dto.ProfileRequest;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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


}