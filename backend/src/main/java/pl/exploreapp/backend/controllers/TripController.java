package pl.exploreapp.backend.controllers;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pl.exploreapp.backend.models.Trip;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    @GetMapping
    public List<Trip> getAllTrips() {
        // Na razie zwracamy testowe dane wpisane na sztywno, żeby sprawdzić czy działa
        Trip trip1 = new Trip("Wycieczka do Paryża", "Cudowny weekend w stolicy Francji", 2499.0);
        Trip trip2 = new Trip("Słoneczna Barcelona", "Relaks na plaży i zwiedzanie dzieł Gaudiego", 1999.0);
        
        return Arrays.asList(trip1, trip2);
    }
}