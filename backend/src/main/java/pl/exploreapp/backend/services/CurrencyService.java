package pl.exploreapp.backend.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class CurrencyService {

    private final String currencyApiKey;
    private final RestClient restClient;

    public CurrencyService(@Value("${currency.api.key}") String currencyApiKey) {
        this.currencyApiKey = currencyApiKey;
        this.restClient = RestClient.create();
    }

    @Cacheable(value = "currencyRates")
    @SuppressWarnings("rawtypes")
    public Map<String, Double> fetchExchangeRates() {
        if (currencyApiKey == null || currencyApiKey.isBlank()) {
            return getDefaultRates();
        }

        try {
            String url = String.format(
                    "https://v6.exchangerate-api.com/v6/%s/latest/PLN",
                    currencyApiKey
            );

            Map response = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(Map.class);

            if (response == null || !response.containsKey("conversion_rates")) {
                return getDefaultRates();
            }

            Map conversionRates = (Map) response.get("conversion_rates");
            Map<String, Double> targetRates = new HashMap<>();
            String[] checkedCurrencies = {"EUR", "USD", "GBP", "CZK"};

            for (String curr : checkedCurrencies) {
                if (conversionRates.containsKey(curr)) {
                    double rateFromPln = ((Number) conversionRates.get(curr)).doubleValue();

                    if (rateFromPln > 0) {
                        targetRates.put(curr, Math.round((1 / rateFromPln) * 100.0) / 100.0);
                    }
                }
            }

            return targetRates;
        } catch (Exception e) {
            return getDefaultRates();
        }
    }

    private Map<String, Double> getDefaultRates() {
        Map<String, Double> defaults = new HashMap<>();
        defaults.put("EUR", 4.35);
        defaults.put("USD", 4.00);
        defaults.put("GBP", 5.00);
        defaults.put("CZK", 0.18);
        return defaults;
    }
}