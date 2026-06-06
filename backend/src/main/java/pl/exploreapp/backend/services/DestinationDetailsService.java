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
        List<DestinationDetailsResponse.ForecastDay> forecast = fetchForecast(query);
        Map<String, Double> rates = currencyService.fetchExchangeRates();

        return new DestinationDetailsResponse(
                query,
                imageUrl,
                weatherInfo,
                forecast,
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
           Map response = restClient.get()
        .uri(
                "https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric",
                query,
                weatherApiKey
        )
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

    @SuppressWarnings({"rawtypes"})
    private List<DestinationDetailsResponse.ForecastDay> fetchForecast(String query) {
    if (weatherApiKey == null || weatherApiKey.isBlank()) {
        return List.of(
                new DestinationDetailsResponse.ForecastDay("Today", 22.0, "sunny", "01d"),
                new DestinationDetailsResponse.ForecastDay("Tomorrow", 21.0, "partly cloudy", "02d"),
                new DestinationDetailsResponse.ForecastDay("Day 3", 20.0, "cloudy", "03d")
        );
    }

    try {
        Map response = restClient.get()
        .uri(
                "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric",
                query,
                weatherApiKey
        )
        .retrieve()
        .body(Map.class);

        if (response == null || !response.containsKey("list")) {
            return List.of();
        }

        List forecastList = (List) response.get("list");
        List<DestinationDetailsResponse.ForecastDay> forecast = new java.util.ArrayList<>();

        for (Object item : forecastList) {
            Map forecastItem = (Map) item;
            String dateTime = (String) forecastItem.get("dt_txt");

            if (dateTime == null || !dateTime.contains("12:00:00")) {
                continue;
            }

            String date = dateTime.substring(0, 10);

            Map main = (Map) forecastItem.get("main");
            double temperature = ((Number) main.get("temp")).doubleValue();

            List weatherList = (List) forecastItem.get("weather");
            Map weatherObject = (Map) weatherList.get(0);

            String description = (String) weatherObject.get("description");
            String icon = (String) weatherObject.get("icon");

            forecast.add(new DestinationDetailsResponse.ForecastDay(
                    date,
                    Math.round(temperature * 10.0) / 10.0,
                    description,
                    icon
            ));

            if (forecast.size() == 5) {
                break;
            }
        }

        return forecast;
    } catch (Exception e) {
        return List.of();
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