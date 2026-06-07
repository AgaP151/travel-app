package pl.exploreapp.backend.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pl.exploreapp.backend.dto.CreateTripRequest;
import pl.exploreapp.backend.dto.InviteUserRequest;
import pl.exploreapp.backend.dto.TripParticipantResponse;
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

    @GetMapping("/{id}/participants")
    public List<TripParticipantResponse> getTripParticipants(@PathVariable Long id) {
        return tripService.getTripParticipants(id);
    }

    @PostMapping
    public Trip createTrip(@RequestBody CreateTripRequest request) {
        return tripService.createTrip(request);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
    }

    @PostMapping("/{id}/invite")
    public void inviteUserToTrip(
            @PathVariable Long id,
            @RequestBody InviteUserRequest request
    ) {
        tripService.inviteUserToTrip(id, request);
    }

    @PostMapping("/{id}/copy")
    public Trip copyPublicDemoTrip(@PathVariable Long id) {
        return tripService.copyPublicDemoTrip(id);
    }

    @DeleteMapping("/{id}/users")
    public void removeUserFromTrip(
            @PathVariable Long id,
            @RequestBody InviteUserRequest request
    ) {
        tripService.removeUserFromTrip(id, request);
    }
}