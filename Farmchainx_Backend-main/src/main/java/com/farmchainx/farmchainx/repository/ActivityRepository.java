// ActivityRepository.java
package com.farmchainx.farmchainx.repository;

import com.farmchainx.farmchainx.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findTop10ByOrderByCreatedAtDesc();
}