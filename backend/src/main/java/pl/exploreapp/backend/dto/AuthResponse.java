package pl.exploreapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private String token;

    public AuthResponse(String message) {
        this.message = message;
        this.token = null;
    }
}