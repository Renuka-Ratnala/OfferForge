package com.offerforge.controller;

import com.offerforge.dto.InterviewEvaluationRequest;
import com.offerforge.dto.InterviewEvaluationResponse;
import com.offerforge.dto.InterviewQuestionResponse;
import com.offerforge.dto.InterviewStartRequest;
import com.offerforge.service.AIInterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/interview")
@RequiredArgsConstructor
public class AIInterviewController {

    private final AIInterviewService aiInterviewService;

    @PostMapping("/question")
    public InterviewQuestionResponse generateQuestion(
            @RequestBody InterviewStartRequest request
    ) {

        return aiInterviewService.generateQuestion(
                request.getRole(),
                request.getType(),
                request.getDifficulty()
        );
    }

    @PostMapping("/evaluate")
    public InterviewEvaluationResponse evaluateAnswer(
            @RequestBody InterviewEvaluationRequest request
    ) {

        return aiInterviewService.evaluateAnswer(
                request.getQuestion(),
                request.getAnswer(),
                request.getRole(),
                request.getType(),
                request.getDifficulty()
        );
    }
}