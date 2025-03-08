package com.adi.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adi.dto.FoodDto;
import com.adi.model.Food;
import com.adi.model.Restaurant;
import com.adi.model.USER_ROLE;
import com.adi.model.User;
import com.adi.repository.FoodRepository;
import com.adi.repository.RestaurantRepository;

@Service
public class FoodServiceImpl implements FoodService {
    
    @Autowired
    private FoodRepository foodRepository;
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Override
    public Food addFoodItem(FoodDto foodDto, Restaurant restaurant, User user) {
        if (!user.getRole().equals(USER_ROLE.ROLE_RESTAURANT_OWNER)) {
            throw new RuntimeException("Only restaurant owners can add food items");
        }
        
        if (restaurant.getOwner().getId() != user.getId()) {
            throw new RuntimeException("You are not the owner of this restaurant");
        }
        
        Food food = new Food();
        food.setName(foodDto.getName());
        food.setDescription(foodDto.getDescription());
        food.setPrice(Long.valueOf((long) foodDto.getPrice()));
        
        List<String> images = new ArrayList<>();
        if (foodDto.getImageUrl() != null) {
            images.add(foodDto.getImageUrl());
        }
        food.setImages(images);
        
        food.setVegetarian(foodDto.isVegetarian());
        food.setAvailable(true);
        food.setRestaurant(restaurant);
        food.setCreationDate(new Date());
        
        return foodRepository.save(food);
    }
    
    @Override
    public Food getFoodById(Long id) {
        Optional<Food> optionalFood = foodRepository.findById(id);
        
        if (optionalFood.isEmpty()) {
            throw new RuntimeException("Food not found with id: " + id);
        }
        
        return optionalFood.get();
    }
    
    @Override
    public List<Food> getRestaurantFoods(Long restaurantId) {
        return foodRepository.findByRestaurantId(restaurantId);
    }
    
    @Override
    public List<Food> searchFoodsByName(String name) {
        return foodRepository.findByNameContainingIgnoreCase(name);
    }
} 