package pl.exploreapp.backend.dto;

import java.util.Map;

public class DestinationDetailsResponse {

    private String query;
    private String imageUrl;
    private WeatherInfo weather; // Zmienione z String na obiekt strukturalny
    private Map<String, Double> conversionRates; // Zmienione z String na mapę kursów

    public DestinationDetailsResponse(String query, String imageUrl, WeatherInfo weather, Map<String, Double> conversionRates) {
        this.query = query;
        this.imageUrl = imageUrl;
        this.weather = weather;
        this.conversionRates = conversionRates;
    }

    public String getQuery() {
        return query;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public WeatherInfo getWeather() {
        return weather;
    }

    public Map<String, Double> getConversionRates() {
        return conversionRates;
    }

    
    public static class WeatherInfo {
        private double temperature;
        private int humidity;
        private double windSpeed;
        private String description;

        public WeatherInfo(double temperature, int humidity, double windSpeed, String description) {
            this.temperature = temperature;
            this.humidity = humidity;
            this.windSpeed = windSpeed;
            this.description = description;
        }

        public double getTemperature() {
            return temperature;
        }

        public int getHumidity() {
            return humidity;
        }

        public double getWindSpeed() {
            return windSpeed;
        }

        public String getDescription() {
            return description;
        }
    }
}