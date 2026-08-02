package com.offerforge.controller;

import com.offerforge.entity.Job;
import com.offerforge.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping("/{companyId}")
    public Job addJob(@PathVariable Long companyId,
                      @RequestBody Job job) {

        return jobService.addJob(companyId, job);
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/{id}")
    public Job getJob(@PathVariable Long id) {
        return jobService.getJob(id);
    }


    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return "Job deleted successfully!";
    }
}