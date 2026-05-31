package pl.exploreapp.backend.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import pl.exploreapp.backend.dto.CreateTripRequest;
import pl.exploreapp.backend.models.Trip;
import pl.exploreapp.backend.repositories.TripRepository;

@Service
public class TripService {
private static final Logger logger = LoggerFactory.getLogger(TripService.class);
    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

   public List<Trip> getAllTrips() {
    logger.info("Fetching all trips");

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
logger.info("Creating trip with title: {}", request.getTitle());
        return tripRepository.save(trip);
    }

    public void deleteTrip(Long id) {
         logger.info("Deleting trip with id: {}", id);
        tripRepository.deleteById(id);
    }
}