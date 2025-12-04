// RatingService.java
package com.farmchainx.farmchainx.service;

import com.farmchainx.farmchainx.model.Rating;
import com.farmchainx.farmchainx.model.User;
import com.farmchainx.farmchainx.repository.RatingRepository;
import com.farmchainx.farmchainx.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ProductRepository productRepository;

    public RatingService(RatingRepository ratingRepository, ProductRepository productRepository) {
        this.ratingRepository = ratingRepository;
        this.productRepository = productRepository;
    }

    // Add this exact method to fix the error
    public Rating addRating(Long productId, Rating rating, User user) {
        // Set the product and user for the rating
        rating.setProduct(productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId)));
        rating.setUser(user);

        // Save the rating
        Rating savedRating = ratingRepository.save(rating);

        // Update product's average rating
        updateProductAverageRating(productId);

        return savedRating;
    }

    // Method to update product's average rating
    private void updateProductAverageRating(Long productId) {
        List<Rating> ratings = ratingRepository.findByProductId(productId);

        if (!ratings.isEmpty()) {
            double average = ratings.stream()
                    .mapToInt(Rating::getStars)
                    .average()
                    .orElse(0.0);

            // Update the product's average rating
            productRepository.findById(productId).ifPresent(product -> {
                product.setAverageRating(Math.round(average * 10.0) / 10.0); // Round to 1 decimal
                productRepository.save(product);
            });
        }
    }

    public List<Rating> getRatingsByProductId(Long productId) {
        return ratingRepository.findByProductId(productId);
    }

    public Rating saveRating(Rating rating) {
        return ratingRepository.save(rating);
    }

    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }

    public List<Rating> getAllRatings() {
        return ratingRepository.findAllByOrderByCreatedAtDesc();
    }

    // Additional useful methods
    public Optional<Rating> getRatingById(Long id) {
        return ratingRepository.findById(id);
    }

    public boolean hasUserRatedProduct(Long productId, Long userId) {
        return ratingRepository.findByProductIdAndUserId(productId, userId).isPresent();
    }
}