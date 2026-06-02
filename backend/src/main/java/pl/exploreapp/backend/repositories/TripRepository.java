package pl.exploreapp.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import pl.exploreapp.backend.models.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {

    @Query(value = """
            SELECT t.*
            FROM trips t
            JOIN trip_user tu ON t.id = tu.trip_id
            WHERE tu.user_id = :userId
            """, nativeQuery = true)
    List<Trip> findAllByUserId(Long userId);

    @Modifying
    @Query(value = """
            INSERT INTO trip_user (trip_id, user_id)
            VALUES (:tripId, :userId)
            """, nativeQuery = true)
    void addUserToTrip(Long tripId, Long userId);

    @Query(value = """
            SELECT COUNT(*) > 0
            FROM trip_user
            WHERE trip_id = :tripId AND user_id = :userId
            """, nativeQuery = true)
    boolean existsByTripIdAndUserId(Long tripId, Long userId);
}