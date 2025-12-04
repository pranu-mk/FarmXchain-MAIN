// RatingRepository.java
package com.farmchainx.farmchainx.repository;

import com.farmchainx.farmchainx.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    // Find all ratings for a specific product
    List<Rating> findByProductId(Long productId);

    // Find all ratings ordered by creation date (newest first)
    List<Rating> findAllByOrderByCreatedAtDesc();

    // Check if user has already rated a product
    Optional<Rating> findByProductIdAndUserId(Long productId, Long userId);
}