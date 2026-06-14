package pl.exploreapp.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pl.exploreapp.backend.services.MailService;

@RestController
@RequestMapping("/api/mail")
public class MailController {

    private final MailService mailService;

    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping("/test")
    public ResponseEntity<String> sendTestEmail(@RequestParam String to) {
        mailService.sendTestEmail(to);
        return ResponseEntity.ok("Test email request sent");
    }
}