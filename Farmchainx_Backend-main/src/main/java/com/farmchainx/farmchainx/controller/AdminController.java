// AdminController.java
package com.farmchainx.farmchainx.controller;

import com.farmchainx.farmchainx.model.*;
import com.farmchainx.farmchainx.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // User Statistics
    @GetMapping("/users/stats")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        try {
            Map<String, Object> stats = adminService.getUserStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user statistics"));
        }
    }

    // Purchase Analytics
    @GetMapping("/analytics/purchases")
    public ResponseEntity<List<PurchaseAnalytics>> getPurchaseAnalytics() {
        try {
            List<PurchaseAnalytics> analytics = adminService.getPurchaseAnalytics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Product Analytics
    @GetMapping("/analytics/products")
    public ResponseEntity<List<ProductAnalytics>> getProductAnalytics() {
        try {
            List<ProductAnalytics> analytics = adminService.getProductAnalytics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // System Metrics
    @GetMapping("/analytics/metrics")
    public ResponseEntity<Map<String, Object>> getSystemMetrics() {
        try {
            Map<String, Object> metrics = adminService.getSystemMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch system metrics"));
        }
    }

    // Recent Activities
    @GetMapping("/activities/recent")
    public ResponseEntity<List<Activity>> getRecentActivities() {
        try {
            List<Activity> activities = adminService.getRecentActivities();
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // All Ratings with Comments
    @GetMapping("/ratings")
    public ResponseEntity<List<Rating>> getAllRatings() {
        try {
            List<Rating> ratings = adminService.getAllRatings();
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Delete Rating
    @DeleteMapping("/ratings/{id}")
    public ResponseEntity<?> deleteRating(@PathVariable Long id) {
        try {
            adminService.deleteRating(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete rating");
        }
    }

    // System Overview
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getSystemOverview() {
        try {
            Map<String, Object> overview = adminService.getSystemOverview();
            return ResponseEntity.ok(overview);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch system overview"));
        }
    }
}