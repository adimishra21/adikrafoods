package com.adi.service;

import java.util.List;

import com.adi.dto.RestaurantDto;
import com.adi.model.Restaurant;
import com.adi.model.User;

public interface RestaurantService {
    
    Restaurant createRestaurant(RestaurantDto restaurantDto, User user);
    
    Restaurant getRestaurantById(Long id);
    
    List<Restaurant> getAllRestaurants();
    
    List<Restaurant> searchRestaurantsByName(String name);
    
} 