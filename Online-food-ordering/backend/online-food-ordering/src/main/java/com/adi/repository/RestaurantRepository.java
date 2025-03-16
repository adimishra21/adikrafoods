package com.adi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adi.model.Restaurant;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    
    List<Restaurant> findByNameContainingIgnoreCase(String name);
    
    List<Restaurant> findByOwnerId(Long ownerId);
    
} 