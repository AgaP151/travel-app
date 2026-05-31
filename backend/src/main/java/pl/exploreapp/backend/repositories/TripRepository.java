package pl.exploreapp.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import pl.exploreapp.backend.models.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {
}