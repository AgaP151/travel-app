package pl.exploreapp.backend.services;

import org.springframework.stereotype.Service;

import pl.exploreapp.backend.dto.DestinationDetailsResponse;

@Service
public class DestinationDetailsService {

    public DestinationDetailsResponse getDetails(String query) {
        return new DestinationDetailsResponse(
                query,
                "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
                "Weather data will be loaded from external API",
                "Currency data will be loaded from external API"
        );
    }
}