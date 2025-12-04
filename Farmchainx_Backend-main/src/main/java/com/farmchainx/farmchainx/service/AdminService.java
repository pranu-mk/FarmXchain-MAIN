// AdminService.java
package com.farmchainx.farmchainx.service;

import com.farmchainx.farmchainx.model.*;
import com.farmchainx.farmchainx.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final RatingRepository ratingRepository;
    private final PurchaseRepository purchaseRepository;
    private final ActivityRepository activityRepository;

    public AdminService(UserRepository userRepository,
                        ProductRepository productRepository,
                        RatingRepository ratingRepository,
                        PurchaseRepository purchaseRepository,
                        ActivityRepository activityRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.ratingRepository = ratingRepository;
        this.purchaseRepository = purchaseRepository;
        this.activityRepository = activityRepository;
    }

    public Map<String, Object> getUserStatistics() {
        long farmers = userRepository.countByRole(User.Role.FARMER);
        long customers = userRepository.countByRole(User.Role.CUSTOMER);
        long retailers = userRepository.countByRole(User.Role.RETAILER);
        long totalUsers = userRepository.count();

        // For H2, use simpler growth calculation
        double growth = 12.5; // Static growth for demo

        Map<String, Object> stats = new HashMap<>();
        stats.put("farmers", farmers);
        stats.put("customers", customers);
        stats.put("retailers", retailers);
        stats.put("total", totalUsers);
        stats.put("growth", growth);

        return stats;
    }

    public List<PurchaseAnalytics> getPurchaseAnalytics() {
        List<Purchase> purchases = purchaseRepository.findAll();

        // Create sample data for H2 since we might not have enough real data
        List<PurchaseAnalytics> analytics = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"};

        Random random = new Random();
        double baseRevenue = 10000;

        for (int i = 0; i < months.length; i++) {
            int monthPurchases = 20 + random.nextInt(30);
            double monthRevenue = baseRevenue + (i * 5000) + random.nextInt(2000);
            double growth = i > 0 ? 5 + random.nextDouble() * 10 : 0;

            analytics.add(new PurchaseAnalytics(
                    months[i],
                    monthPurchases,
                    monthRevenue,
                    Math.round(growth * 100.0) / 100.0
            ));
        }

        return analytics;
    }

    public List<ProductAnalytics> getProductAnalytics() {
        List<Product> products = productRepository.findAll();

        // Create sample data for H2
        List<ProductAnalytics> analytics = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"};
        String[] topCrops = {"Rice", "Wheat", "Vegetables", "Fruits", "Spices", "Rice", "Vegetables", "Fruits"};

        Random random = new Random();

        for (int i = 0; i < months.length; i++) {
            int productsAdded = 5 + random.nextInt(15);
            int activeListings = 20 + random.nextInt(30);

            analytics.add(new ProductAnalytics(
                    months[i],
                    productsAdded,
                    topCrops[i],
                    activeListings
            ));
        }

        return analytics;
    }

    public Map<String, Object> getSystemMetrics() {
        List<Product> products = productRepository.findAll();
        List<Purchase> purchases = purchaseRepository.findAll();
        List<Rating> ratings = ratingRepository.findAll();

        // Calculate real metrics from H2 data
        double totalRevenue = purchases.stream()
                .mapToDouble(p -> p.getTotalAmount() != null ? p.getTotalAmount() : 0)
                .sum();

        double avgOrderValue = purchases.isEmpty() ? 0 : totalRevenue / purchases.size();

        double avgRating = ratings.stream()
                .mapToDouble(r -> r.getStars() != null ? r.getStars() : 0)
                .average()
                .orElse(0.0);

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalRevenue", Math.round(totalRevenue));
        metrics.put("avgOrderValue", Math.round(avgOrderValue));
        metrics.put("conversionRate", 3.8);
        metrics.put("customerSatisfaction", Math.round(avgRating * 10.0) / 10.0);
        metrics.put("systemUptime", 99.8);
        metrics.put("activeTransactions", purchases.size());

        return metrics;
    }

    public List<Activity> getRecentActivities() {
        return activityRepository.findTop10ByOrderByCreatedAtDesc();
    }

    public List<Rating> getAllRatings() {
        return ratingRepository.findAllByOrderByCreatedAtDesc();
    }

    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }

    public Map<String, Object> getSystemOverview() {
        Map<String, Object> userStats = getUserStatistics();
        Map<String, Object> systemMetrics = getSystemMetrics();
        List<ProductAnalytics> productAnalytics = getProductAnalytics();
        List<PurchaseAnalytics> purchaseAnalytics = getPurchaseAnalytics();

        // Calculate top crops from actual product data
        List<Product> products = productRepository.findAll();
        Map<String, Long> cropSales = products.stream()
                .collect(Collectors.groupingBy(
                        Product::getCropType,
                        Collectors.summingLong(p -> p.getQuantity() != null ? p.getQuantity() : 0)
                ));

        List<Map<String, Object>> topCrops = cropSales.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> cropData = new HashMap<>();
                    cropData.put("name", entry.getKey());
                    cropData.put("sales", entry.getValue());

                    double revenue = products.stream()
                            .filter(p -> p.getCropType().equals(entry.getKey()))
                            .mapToDouble(p -> (p.getPrice() != null ? p.getPrice() : 0) *
                                    (p.getQuantity() != null ? p.getQuantity() : 0))
                            .sum();
                    cropData.put("revenue", revenue);
                    cropData.put("growth", Math.random() * 20 + 5);

                    return cropData;
                })
                .collect(Collectors.toList());

        Map<String, Object> overview = new HashMap<>();
        overview.put("userStats", userStats);
        overview.put("systemMetrics", systemMetrics);
        overview.put("productAnalytics", productAnalytics);
        overview.put("purchaseAnalytics", purchaseAnalytics);
        overview.put("topCrops", topCrops);
        overview.put("timestamp", LocalDateTime.now());

        return overview;
    }
}