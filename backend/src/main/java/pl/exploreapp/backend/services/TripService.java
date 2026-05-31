package pl.exploreapp.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import pl.exploreapp.backend.models.Trip;
import pl.exploreapp.backend.repositories.TripRepository;

@Service
public class TripService {

    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
}