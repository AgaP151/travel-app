package pl.exploreapp.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import pl.exploreapp.backend.models.Trip;
import pl.exploreapp.backend.repositories.TripRepository;
import pl.exploreapp.backend.dto.CreateTripRequest;

@Service
public class TripService {

    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
    public Trip createTrip(CreateTripRequest request) {
    Trip trip = new Trip();

    trip.setCategoryId(request.getCategoryId());
    trip.setTitle(request.getTitle());
    trip.setDestination(request.getDestination());
    trip.setStartDate(request.getStartDate());
    trip.setEndDate(request.getEndDate());
    trip.setDescription(request.getDescription());
    trip.setPrice(request.getPrice());
    trip.setArchived(false);

    return tripRepository.save(trip);
}
}