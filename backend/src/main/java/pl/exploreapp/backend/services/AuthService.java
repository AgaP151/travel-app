package pl.exploreapp.backend.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import pl.exploreapp.backend.dto.AuthResponse;
import pl.exploreapp.backend.dto.RegisterRequest;
import pl.exploreapp.backend.models.User;
import pl.exploreapp.backend.repositories.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
}

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return new AuthResponse("Confirmation email has been sent.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setLocale("pl");
        user.setRole("ROLE_USER");

        userRepository.save(user);

        return new AuthResponse("Confirmation email has been sent.");
    }
}