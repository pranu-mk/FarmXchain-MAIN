// RatingController.java
package com.farmchainx.farmchainx.controller;

import com.farmchainx.farmchainx.model.Rating;
import com.farmchainx.farmchainx.model.User;
import com.farmchainx.farmchainx.service.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    // Add rating to a product
    @PostMapping("/{productId}/ratings")
    public ResponseEntity<?> addRating(
            @PathVariable Long productId,
            @RequestBody Rating rating,
            @AuthenticationPrincipal User user) {

        try {
            Rating savedRating = ratingService.addRating(productId, rating, user);
            return ResponseEntity.ok(savedRating);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add rating: " + e.getMessage());
        }
    }

    // Get all ratings for a product
    @GetMapping("/{productId}/ratings")
    public ResponseEntity<List<Rating>> getProductRatings(@PathVariable Long productId) {
        try {
            List<Rating> ratings = ratingService.getRatingsByProductId(productId);
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Get all ratings (for admin)
    @GetMapping("/ratings")
    public ResponseEntity<List<Rating>> getAllRatings() {
        try {
            List<Rating> ratings = ratingService.getAllRatings();
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Delete a rating
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<?> deleteRating(@PathVariable Long ratingId) {
        try {
            ratingService.deleteRating(ratingId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete rating");
        }
    }
}