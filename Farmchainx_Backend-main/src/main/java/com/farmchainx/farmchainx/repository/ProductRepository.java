package com.farmchainx.farmchainx.repository;

import com.farmchainx.farmchainx.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}