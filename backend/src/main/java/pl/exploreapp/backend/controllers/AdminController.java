package pl.exploreapp.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

    @GetMapping("/api/admin/health")
    public String adminHealth() {
        return "Admin access granted";
    }
}