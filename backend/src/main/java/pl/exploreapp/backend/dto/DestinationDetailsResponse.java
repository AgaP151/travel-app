package pl.exploreapp.backend.dto;

import java.util.List;
import java.util.Map;

public class DestinationDetailsResponse {

    private String query;
    private String imageUrl;
    private WeatherInfo weather;
    private List<ForecastDay> forecast;
    private Map<String, Double> conversionRates;

    public DestinationDetailsResponse(
            String query,
            String imageUrl,
            WeatherInfo weather,
            List<ForecastDay> forecast,
            Map<String, Double> conversionRates
    ) {
        this.query = query;
        this.imageUrl = imageUrl;
        this.weather = weather;
        this.forecast = forecast;
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

    public List<ForecastDay> getForecast() {
        return forecast;
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

    public static class ForecastDay {
        private String date;
        private double temperature;
        private String description;
        private String icon;

        public ForecastDay(String date, double temperature, String description, String icon) {
            this.date = date;
            this.temperature = temperature;
            this.description = description;
            this.icon = icon;
        }

        public String getDate() {
            return date;
        }

        public double getTemperature() {
            return temperature;
        }

        public String getDescription() {
            return description;
        }

        public String getIcon() {
            return icon;
        }
    }
}