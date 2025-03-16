package com.adi.service;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adi.dto.RestaurantDto;
import com.adi.model.Restaurant;
import com.adi.model.USER_ROLE;
import com.adi.model.User;
import com.adi.repository.RestaurantRepository;
import com.adi.service.UserService;
import com.adi.repository.UserRepository;

@Service
public class RestaurantServiceImpl implements RestaurantService {
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
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
    
    @Override
    public Restaurant toggleFavorite(Long restaurantId, User user) {
        if (restaurantId == null) {
            throw new RuntimeException("Restaurant ID must not be null");
        }
        
        Restaurant restaurant = getRestaurantById(restaurantId);
        System.out.println("Found restaurant: " + restaurant.getName() + " with ID: " + restaurant.getId());
        
        // Convert restaurant to DTO for favorites list
        RestaurantDto dto = new RestaurantDto();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setDescription(restaurant.getDescription());
        
        System.out.println("Created DTO with ID: " + dto.getId());
        System.out.println("Current favorites count: " + user.getFavorites().size());
        
        // Check if restaurant is already in favorites
        boolean isAlreadyFavorite = user.getFavorites().stream()
                .anyMatch(fav -> {
                    System.out.println("Comparing fav ID: " + fav.getId() + " with restaurant ID: " + restaurant.getId());
                    return fav.getId() != null && fav.getId().equals(restaurant.getId());
                });
        
        if (isAlreadyFavorite) {
            System.out.println("Removing from favorites");
            user.getFavorites().removeIf(fav -> 
                fav.getId() != null && fav.getId().equals(restaurant.getId())
            );
        } else {
            System.out.println("Adding to favorites");
            user.getFavorites().add(dto);
        }
        
        // Save the updated user
        User savedUser = userService.saveUser(user);
        System.out.println("Saved user favorites count: " + savedUser.getFavorites().size());
        
        return restaurant;
    }
    
    @Override
    public List<Restaurant> getUserFavorites(User user) {
        return user.getFavorites().stream()
                .map(dto -> getRestaurantById(dto.getId()))
                .toList();
    }
    
    @Override
    public Restaurant updateRestaurant(Long id, Restaurant updatedRestaurant, User user) {
        if (!user.getRole().equals(USER_ROLE.ROLE_RESTAURANT_OWNER)) {
            throw new RuntimeException("Only restaurant owners can update restaurants");
        }
        
        Restaurant existingRestaurant = getRestaurantById(id);
        
        if (!existingRestaurant.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You can only update your own restaurants");
        }
        
        existingRestaurant.setName(updatedRestaurant.getName());
        existingRestaurant.setCuisineType(updatedRestaurant.getCuisineType());
        existingRestaurant.setAddress(updatedRestaurant.getAddress());
        existingRestaurant.setImageUrl(updatedRestaurant.getImageUrl());
        existingRestaurant.setMinOrderAmount(updatedRestaurant.getMinOrderAmount());
        existingRestaurant.setDeliveryFee(updatedRestaurant.getDeliveryFee());
        existingRestaurant.setOpeningTime(updatedRestaurant.getOpeningTime());
        existingRestaurant.setClosingTime(updatedRestaurant.getClosingTime());
        
        return restaurantRepository.save(existingRestaurant);
    }
    
    @Override
    public void deleteRestaurant(Long id, User user) {
        if (!user.getRole().equals(USER_ROLE.ROLE_RESTAURANT_OWNER)) {
            throw new RuntimeException("Only restaurant owners can delete restaurants");
        }
        
        Restaurant restaurant = getRestaurantById(id);
        
        if (!restaurant.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own restaurants");
        }
        
        restaurantRepository.delete(restaurant);
    }
    
    @Override
    public List<Restaurant> getRestaurantsByOwnerId(Long ownerId) {
        return restaurantRepository.findByOwnerId(ownerId);
    }
    
    @Override
    public void toggleFavoriteRestaurant(Long id, User user) {
        Restaurant restaurant = getRestaurantById(id);
        
        if (user.getFavoriteRestaurants().contains(restaurant)) {
            user.getFavoriteRestaurants().remove(restaurant);
        } else {
            user.getFavoriteRestaurants().add(restaurant);
        }
        
        userRepository.save(user);
    }
    
    @Override
    public List<Restaurant> getFavoriteRestaurants(User user) {
        return new ArrayList<>(user.getFavoriteRestaurants());
    }
} 