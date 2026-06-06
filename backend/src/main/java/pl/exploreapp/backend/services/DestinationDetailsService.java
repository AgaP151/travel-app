package pl.exploreapp.backend.services;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import pl.exploreapp.backend.dto.DestinationDetailsResponse;

@Service
public class DestinationDetailsService {

    private final String pexelsApiKey;
    private final String weatherApiKey;
    private final CurrencyService currencyService;
    private final RestClient restClient;

    public DestinationDetailsService(
            @Value("${pexels.api.key}") String pexelsApiKey,
            @Value("${weather.api.key}") String weatherApiKey,
            CurrencyService currencyService) {
        this.pexelsApiKey = pexelsApiKey;
        this.weatherApiKey = weatherApiKey;
        this.currencyService = currencyService;
        this.restClient = RestClient.create();
    }

    public DestinationDetailsResponse getDetails(String query) {
        String imageUrl = fetchImageUrl(query);
        DestinationDetailsResponse.WeatherInfo weatherInfo = fetchWeather(query);
        Map<String, Double> rates = currencyService.fetchExchangeRates();

        return new DestinationDetailsResponse(
                query,
                imageUrl,
                weatherInfo,
                rates
        );
    }

    @SuppressWarnings("rawtypes")
    private String fetchImageUrl(String query) {
        String pexelsQuery = normalizeDestinationForImageSearch(query);

        if (pexelsApiKey == null || pexelsApiKey.isBlank()) {
            return null;
        }

        try {
            Map response = restClient.get()
                    .uri("https://api.pexels.com/v1/search?query={query}&per_page=10", pexelsQuery)
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

            int randomIndex = ThreadLocalRandom.current().nextInt(photos.size());
            Map selectedPhoto = (Map) photos.get(randomIndex);
            Map src = (Map) selectedPhoto.get("src");

            return (String) src.get("large");
        } catch (Exception e) {
            return null;
        }
    }

    @SuppressWarnings("rawtypes")
    private DestinationDetailsResponse.WeatherInfo fetchWeather(String query) {
        if (weatherApiKey == null || weatherApiKey.isBlank()) {
            return new DestinationDetailsResponse.WeatherInfo(
                    22.0,
                    50,
                    10.0,
                    "clear sky (fallback)"
            );
        }

        try {
            String url = String.format(
                    "https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric",
                    query,
                    weatherApiKey
            );

            Map response = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(Map.class);

            if (response == null) {
                throw new RuntimeException("Empty weather response");
            }

            Map main = (Map) response.get("main");
            List weatherList = (List) response.get("weather");
            Map weatherObject = (Map) weatherList.get(0);
            Map wind = (Map) response.get("wind");

            double temp = ((Number) main.get("temp")).doubleValue();
            int humidity = ((Number) main.get("humidity")).intValue();
            double windSpeed = ((Number) wind.get("speed")).doubleValue();
            String description = (String) weatherObject.get("description");

            return new DestinationDetailsResponse.WeatherInfo(
                    temp,
                    humidity,
                    windSpeed,
                    description
            );
        } catch (Exception e) {
            return new DestinationDetailsResponse.WeatherInfo(
                    22.0,
                    48,
                    8.0,
                    "sunny"
            );
        }
    }

    private String normalizeDestinationForImageSearch(String query) {
        if (query == null || query.isBlank()) {
            return "";
        }

        String normalized = query.trim().toLowerCase();

        return switch (normalized) {
            case "praga" -> "Prague landmark";
            case "warszawa" -> "Warsaw Palace of Culture";
            case "kraków", "krakow" -> "Krakow Main Market Square";
            case "jelenia góra", "jelenia gora" -> "Jelenia Gora mountains";
            case "wrocław", "wroclaw" -> "Wroclaw Market Square";
            case "gdańsk", "gdansk" -> "Gdansk old town";
            case "rzym" -> "Rome Colosseum";
            case "paryż", "paryz" -> "Paris Eiffel Tower";
            default -> query.trim() + " landmark";
        };
    }
}