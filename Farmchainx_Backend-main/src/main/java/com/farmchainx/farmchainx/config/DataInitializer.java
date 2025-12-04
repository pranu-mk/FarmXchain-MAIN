package com.farmchainx.farmchainx.config;

import com.farmchainx.farmchainx.model.User;
import com.farmchainx.farmchainx.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create demo users if none exist
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@farmchainx.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build();

            User farmer = User.builder()
                    .name("John Farmer")
                    .email("farmer@farmchainx.com")
                    .password(passwordEncoder.encode("farmer123"))
                    .role(User.Role.FARMER)
                    .build();

            User customer = User.builder()
                    .name("Alice Customer")
                    .email("customer@farmchainx.com")
                    .password(passwordEncoder.encode("customer123"))
                    .role(User.Role.CUSTOMER)
                    .build();

            User retailer = User.builder()
                    .name("Bob Retailer")
                    .email("retailer@farmchainx.com")
                    .password(passwordEncoder.encode("retailer123"))
                    .role(User.Role.RETAILER)
                    .build();

            userRepository.save(admin);
            userRepository.save(farmer);
            userRepository.save(customer);
            userRepository.save(retailer);

            System.out.println("Demo users created successfully!");
        }
    }
}