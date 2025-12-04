package com.farmchainx.farmchainx.controller;

import com.farmchainx.farmchainx.model.Product;
import com.farmchainx.farmchainx.service.ProductService;
import com.farmchainx.farmchainx.service.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    public ProductController(ProductService productService, FileStorageService fileStorageService) {
        this.productService = productService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProduct(
            @RequestParam("name") String name,
            @RequestParam("cropType") String cropType,
            @RequestParam(value = "soilType", required = false) String soilType,
            @RequestParam(value = "pesticides", required = false) String pesticides,
            @RequestParam(value = "harvestDate", required = false) String harvestDate,
            @RequestParam(value = "useBeforeDate", required = false) String useBeforeDate,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "additionalInfo", required = false) String additionalInfo,
            @RequestParam("price") Double price,
            @RequestParam("quantity") Integer quantity,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        try {
            // Create product object from individual parameters
            Product product = Product.builder()
                    .name(name)
                    .cropType(cropType)
                    .soilType(soilType)
                    .pesticides(pesticides)
                    .harvestDate(harvestDate != null && !harvestDate.isEmpty() ? LocalDate.parse(harvestDate) : null)
                    .useBeforeDate(useBeforeDate != null && !useBeforeDate.isEmpty() ? LocalDate.parse(useBeforeDate) : null)
                    .location(location)
                    .additionalInfo(additionalInfo)
                    .price(price)
                    .quantity(quantity)
                    .averageRating(0.0)
                    .build();

            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = fileStorageService.storeFile(imageFile);
                product.setImageUrl("/uploads/" + fileName);
            }

            Product savedProduct = productService.saveProduct(product);
            return ResponseEntity.ok(savedProduct);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload image: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // Add this for debugging
            return ResponseEntity.badRequest().body("Failed to create product: " + e.getMessage());
        }
    }

    // ... rest of your methods remain the same
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        try {
            Product product = productService.updateProduct(id, updatedProduct);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete product");
        }
    }

    @GetMapping("/my-products")
    public ResponseEntity<List<Product>> getMyProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}