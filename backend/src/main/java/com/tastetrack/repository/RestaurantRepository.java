package com.tastetrack.repository;

import com.tastetrack.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    @Query("SELECT r FROM Restaurant r WHERE r.isOpen = true")
    List<Restaurant> findAllOpenRestaurants();
    
    List<Restaurant> findByCuisine(String cuisine);
    
    @Query("SELECT r FROM Restaurant r WHERE r.name LIKE %:name% OR r.cuisine LIKE %:name%")
    List<Restaurant> findByNameOrCuisineContaining(String name);
}
