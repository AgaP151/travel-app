package pl.exploreapp.backend.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import pl.exploreapp.backend.dto.DestinationDetailsResponse;

@Service
public class DestinationDetailsService {

    private final String pexelsApiKey;
    private final RestClient restClient;

    public DestinationDetailsService(@Value("${pexels.api.key}") String pexelsApiKey) {
        this.pexelsApiKey = pexelsApiKey;
        this.restClient = RestClient.create();
    }

    public DestinationDetailsResponse getDetails(String query) {
        String imageUrl = fetchImageUrl(query);

        return new DestinationDetailsResponse(
                query,
                imageUrl,
                "Weather data will be loaded from external API",
                "Currency data will be loaded from external API"
        );
    }

    private String fetchImageUrl(String query) {
        if (pexelsApiKey == null || pexelsApiKey.isBlank()) {
            return null;
        }

        Map response = restClient.get()
                .uri("https://api.pexels.com/v1/search?query={query}&per_page=10", query)
                .header("Authorization", pexelsApiKey)
                .retrieve()
                .body(Map.class);

        if (response == null || !response.containsKey("photos")) {
            return null;
        }

        List photos = (List) response.get("photos");

        if (photos.isEmpty()) {
            return null;
        }
        int randomIndex = java.util.concurrent.ThreadLocalRandom.current().nextInt(photos.size());
        Map selectedPhoto = (Map) photos.get(randomIndex);
        Map src = (Map) selectedPhoto.get("src");

        return (String) src.get("large");
    }
}