package com.farmchainx.farmchainx.controller;

import com.farmchainx.farmchainx.config.JwtUtil;
import com.farmchainx.farmchainx.model.User;
import com.farmchainx.farmchainx.repository.UserRepository;
import com.farmchainx.farmchainx.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder,
                          AuthService authService, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            System.out.println("🔵 Registration attempt received");
            System.out.println("🔵 Request data: " + request);

            String name = request.get("name");
            String email = request.get("email");
            String password = request.get("password");
            String roleStr = request.get("role");

            // Basic validation
            if (name == null || email == null || password == null || roleStr == null) {
                System.out.println("❌ Missing fields");
                return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));
            }

            // Check if email exists
            if (userRepository.findByEmail(email).isPresent()) {
                System.out.println("❌ Email already exists: " + email);
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
            }

            System.out.println("🔵 Creating user with role: " + roleStr);

            // Create user
            User.Role role;
            try {
                role = User.Role.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                System.out.println("❌ Invalid role: " + roleStr);
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid role"));
            }

            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);

            System.out.println("🔵 Saving user to database...");
            User savedUser = userRepository.save(user);
            System.out.println("✅ User saved successfully with ID: " + savedUser.getId());

            // Return response
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedUser.getId());
            response.put("name", savedUser.getName());
            response.put("email", savedUser.getEmail());
            response.put("role", savedUser.getRole());
            response.put("message", "Registration successful");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ REGISTRATION ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
            }

            User user = authService.login(email, password);
            String token = jwtUtil.generateToken(user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole()
            ));
            response.put("message", "Login successful");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}