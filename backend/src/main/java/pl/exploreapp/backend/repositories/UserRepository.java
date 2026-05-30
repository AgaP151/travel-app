package pl.exploreapp.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import pl.exploreapp.backend.models.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}