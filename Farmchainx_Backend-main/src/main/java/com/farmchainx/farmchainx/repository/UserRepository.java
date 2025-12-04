package com.farmchainx.farmchainx.repository;

import com.farmchainx.farmchainx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // Count users by role
    long countByRole(User.Role role);

    // Count users created after a specific date
    long countByCreatedAtAfter(LocalDateTime date);

    // Count users created between two dates
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // Count users by role created after a specific date
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.createdAt > :date")
    long countByRoleAndCreatedAtAfter(@Param("role") User.Role role, @Param("date") LocalDateTime date);

    // Count users by role created between two dates
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.createdAt BETWEEN :start AND :end")
    long countByRoleAndCreatedAtBetween(@Param("role") User.Role role,
                                        @Param("start") LocalDateTime start,
                                        @Param("end") LocalDateTime end);
}