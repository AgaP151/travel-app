package pl.exploreapp.backend.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pl.exploreapp.backend.dto.CreateTripRequest;
import pl.exploreapp.backend.models.Trip;
import pl.exploreapp.backend.services.TripService;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }
    @PostMapping
public Trip createTrip(@RequestBody CreateTripRequest request) {
    return tripService.createTrip(request);
}
}