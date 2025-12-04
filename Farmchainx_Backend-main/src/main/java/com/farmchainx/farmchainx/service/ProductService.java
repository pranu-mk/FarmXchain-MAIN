package com.farmchainx.farmchainx.service;

import com.farmchainx.farmchainx.model.Product;
import com.farmchainx.farmchainx.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Save a new product
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Update existing product
    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setCropType(updatedProduct.getCropType());
            product.setImageUrl(updatedProduct.getImageUrl());
            product.setLocation(updatedProduct.getLocation());
            product.setSoilType(updatedProduct.getSoilType());
            product.setPesticides(updatedProduct.getPesticides());
            product.setHarvestDate(updatedProduct.getHarvestDate());
            product.setUseBeforeDate(updatedProduct.getUseBeforeDate());
            product.setQuantity(updatedProduct.getQuantity());
            product.setPrice(updatedProduct.getPrice());
            product.setAdditionalInfo(updatedProduct.getAdditionalInfo());
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    // Delete product by ID
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}