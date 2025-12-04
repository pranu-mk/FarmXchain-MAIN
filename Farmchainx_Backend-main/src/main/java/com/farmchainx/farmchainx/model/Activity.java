// Activity.java
package com.farmchainx.farmchainx.model;

import lombok.Data;
import jakarta.persistence.*; // Changed to jakarta.persistence for Spring Boot 3.x
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "activities")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // registration, purchase, rating, product, verification
    private String user;
    private String role;
    private String action;
    private String product;
    private String amount;
    private String rating;
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public Activity() {}

    public Activity(String type, String user, String role, String action, String product, String amount, String rating, String status) {
        this.type = type;
        this.user = user;
        this.role = role;
        this.action = action;
        this.product = product;
        this.amount = amount;
        this.rating = rating;
        this.status = status;
    }
}