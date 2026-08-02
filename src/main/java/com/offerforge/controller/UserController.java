package com.offerforge.controller;

import com.offerforge.dto.ProfileRequest;
import com.offerforge.dto.ProfileResponse;
import com.offerforge.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;
import java.io.IOException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ProfileResponse getProfile() {
        return userService.getProfile();
    }
    @PutMapping("/profile")
    public ProfileResponse updateProfile(@Valid @RequestBody ProfileRequest request) {
        return userService.updateProfile(request);
    }
    @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProfileResponse uploadResume(
            @RequestParam("file") MultipartFile file) throws IOException {

        return userService.uploadResume(file);
    }
}