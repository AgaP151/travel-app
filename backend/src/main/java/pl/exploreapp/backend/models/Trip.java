package pl.exploreapp.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Double price;

    // Bezargumentowy konstruktor (wymagany przez JPA)
    public Trip() {}

    // Konstruktor do tworzenia wycieczek
    public Trip(String title, String description, Double price) {
        this.title = title;
        this.description = description;
        this.price = price;
    }

    // Gettery i Settery (żeby Java mogła czytać i zapisywać dane)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}