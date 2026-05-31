package pl.exploreapp.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pl.exploreapp.backend.dto.DestinationDetailsResponse;
import pl.exploreapp.backend.services.DestinationDetailsService;

@RestController
public class DestinationDetailsController {

    private final DestinationDetailsService destinationDetailsService;

    public DestinationDetailsController(DestinationDetailsService destinationDetailsService) {
        this.destinationDetailsService = destinationDetailsService;
    }

    @GetMapping("/api/destinations/details")
    public DestinationDetailsResponse getDestinationDetails(@RequestParam String query) {
        return destinationDetailsService.getDetails(query);
    }
}