package com.adi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adi.model.Food;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    
    List<Food> findByRestaurantId(Long restaurantId);
    
    List<Food> findByNameContainingIgnoreCase(String name);
    
} 