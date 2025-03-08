package com.adi.service;

import java.util.List;

import com.adi.dto.FoodDto;
import com.adi.model.Food;
import com.adi.model.Restaurant;
import com.adi.model.User;

public interface FoodService {
    
    Food addFoodItem(FoodDto foodDto, Restaurant restaurant, User user);
    
    Food getFoodById(Long id);
    
    List<Food> getRestaurantFoods(Long restaurantId);
    
    List<Food> searchFoodsByName(String name);
    
} 