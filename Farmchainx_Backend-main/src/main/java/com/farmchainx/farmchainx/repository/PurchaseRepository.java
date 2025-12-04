// PurchaseRepository.java
package com.farmchainx.farmchainx.repository;

import com.farmchainx.farmchainx.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    // Additional query methods if needed
}