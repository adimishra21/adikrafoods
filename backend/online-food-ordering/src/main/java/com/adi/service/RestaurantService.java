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
    
    Restaurant toggleFavorite(Long restaurantId, User user);
    
    List<Restaurant> getUserFavorites(User user);
    
    Restaurant updateRestaurant(Long id, Restaurant restaurant, User owner);
    
    void deleteRestaurant(Long id, User owner);
    
    List<Restaurant> getRestaurantsByOwnerId(Long ownerId);
    
    void toggleFavoriteRestaurant(Long id, User user);
    
    List<Restaurant> getFavoriteRestaurants(User user);
} 