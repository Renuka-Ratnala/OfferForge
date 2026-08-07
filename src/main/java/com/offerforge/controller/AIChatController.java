package com.offerforge.controller;

import com.offerforge.dto.ChatRequest;
import com.offerforge.dto.ChatResponse;
import com.offerforge.service.AIChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/ai")
public class AIChatController {

    @Autowired
    private AIChatService aiChatService;

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return aiChatService.chat(request.getMessage());
    }

    @GetMapping("/tips")
    public List<String> getCareerTips() {
        return aiChatService.generateCareerTips();
    }
}
