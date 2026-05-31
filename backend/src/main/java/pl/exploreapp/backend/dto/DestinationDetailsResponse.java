package pl.exploreapp.backend.dto;

public class DestinationDetailsResponse {

    private String query;
    private String imageUrl;
    private String weather;
    private String currency;

    public DestinationDetailsResponse(String query, String imageUrl, String weather, String currency) {
        this.query = query;
        this.imageUrl = imageUrl;
        this.weather = weather;
        this.currency = currency;
    }

    public String getQuery() {
        return query;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getWeather() {
        return weather;
    }

    public String getCurrency() {
        return currency;
    }
}