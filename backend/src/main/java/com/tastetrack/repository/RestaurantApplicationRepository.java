package com.tastetrack.repository;

import com.tastetrack.entity.RestaurantApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantApplicationRepository extends JpaRepository<RestaurantApplication, Long> {
    List<RestaurantApplication> findByStatus(RestaurantApplication.ApplicationStatus status);
    Optional<RestaurantApplication> findByEmail(String email);
    boolean existsByEmail(String email);
}
