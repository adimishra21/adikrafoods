package com.adi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adi.dto.RestaurantDto;
import com.adi.model.Restaurant;
import com.adi.model.USER_ROLE;
import com.adi.model.User;
import com.adi.repository.RestaurantRepository;

@Service
public class RestaurantServiceImpl implements RestaurantService {
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Override
    public Restaurant createRestaurant(RestaurantDto restaurantDto, User user) {
        if (!user.getRole().equals(USER_ROLE.ROLE_RESTAURANT_OWNER)) {
            throw new RuntimeException("Only restaurant owners can create restaurants");
        }
        
        Restaurant restaurant = new Restaurant();
        restaurant.setName(restaurantDto.getName());
        restaurant.setDescription(restaurantDto.getDescription());
        restaurant.setOwner(user);
        restaurant.setOpen(true);
        
        return restaurantRepository.save(restaurant);
    }
    
    @Override
    public Restaurant getRestaurantById(Long id) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(id);
        
        if (optionalRestaurant.isEmpty()) {
            throw new RuntimeException("Restaurant not found with id: " + id);
        }
        
        return optionalRestaurant.get();
    }
    
    @Override
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }
    
    @Override
    public List<Restaurant> searchRestaurantsByName(String name) {
        return restaurantRepository.findByNameContainingIgnoreCase(name);
    }
} 