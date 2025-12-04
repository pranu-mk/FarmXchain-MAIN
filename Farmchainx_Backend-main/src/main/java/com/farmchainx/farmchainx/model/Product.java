// Product.java
package com.farmchainx.farmchainx.model;

import jakarta.persistence.*; // Changed to jakarta.persistence
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String cropType;
    private String soilType;
    private String pesticides;
    private LocalDate harvestDate;
    private LocalDate useBeforeDate;
    private String location;
    private String additionalInfo;
    private Double price;
    private Integer quantity;
    private Double averageRating;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id")
    private User farmer;
}