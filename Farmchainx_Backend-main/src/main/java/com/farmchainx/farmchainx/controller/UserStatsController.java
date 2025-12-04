package com.farmchainx.farmchainx.controller;

import com.farmchainx.farmchainx.model.User;
import com.farmchainx.farmchainx.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class UserStatsController {

    private final UserRepository userRepository;

    public UserStatsController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/user-stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        try {
            long totalUsers = userRepository.count();
            long farmers = userRepository.countByRole(User.Role.FARMER);
            long customers = userRepository.countByRole(User.Role.CUSTOMER);
            long retailers = userRepository.countByRole(User.Role.RETAILER);
            long admins = userRepository.countByRole(User.Role.ADMIN);

            Map<String, Object> stats = new HashMap<>();
            stats.put("total", totalUsers);
            stats.put("farmers", farmers);
            stats.put("customers", customers);
            stats.put("retailers", retailers);
            stats.put("admins", admins);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            // Return empty stats in case of error
            Map<String, Object> errorStats = new HashMap<>();
            errorStats.put("total", 0);
            errorStats.put("farmers", 0);
            errorStats.put("customers", 0);
            errorStats.put("retailers", 0);
            errorStats.put("admins", 0);
            return ResponseEntity.ok(errorStats);
        }
    }
}