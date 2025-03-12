package com.adi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adi.dto.RestaurantDto;
import com.adi.model.Restaurant;
import com.adi.model.User;
import com.adi.service.RestaurantService;
import com.adi.service.UserService;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {
    
    @Autowired
    private RestaurantService restaurantService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(
            @RequestBody RestaurantDto restaurantDto,
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserProfileByJwt(jwt);
            Restaurant restaurant = restaurantService.createRestaurant(restaurantDto, user);
            return new ResponseEntity<>(restaurant, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        try {
            List<Restaurant> restaurants = restaurantService.getAllRestaurants();
            return new ResponseEntity<>(restaurants, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        try {
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            return new ResponseEntity<>(restaurant, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/search/{name}")
    public ResponseEntity<List<Restaurant>> searchRestaurantsByName(@PathVariable String name) {
        try {
            List<Restaurant> restaurants = restaurantService.searchRestaurantsByName(name);
            return new ResponseEntity<>(restaurants, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/owner")
    public ResponseEntity<List<Restaurant>> getRestaurantsByOwner() {
        User user = userService.getCurrentUser();
        List<Restaurant> restaurants = restaurantService.getRestaurantsByOwnerId(user.getId());
        return new ResponseEntity<>(restaurants, HttpStatus.OK);
    }
    
    @PostMapping("/{id}/favorite")
    public ResponseEntity<Restaurant> toggleFavorite(
            @PathVariable("id") Long restaurantId,
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserProfileByJwt(jwt);
            Restaurant restaurant = restaurantService.toggleFavorite(restaurantId, user);
            return new ResponseEntity<>(restaurant, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/favorites")
    public ResponseEntity<List<Restaurant>> getUserFavorites(@RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserProfileByJwt(jwt);
            List<Restaurant> favorites = restaurantService.getUserFavorites(user);
            return new ResponseEntity<>(favorites, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(
            @PathVariable Long id, 
            @RequestBody Restaurant restaurant) {
        User user = userService.getCurrentUser();
        Restaurant updatedRestaurant = restaurantService.updateRestaurant(id, restaurant, user);
        return new ResponseEntity<>(updatedRestaurant, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        User user = userService.getCurrentUser();
        restaurantService.deleteRestaurant(id, user);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @PostMapping("/{id}/toggle-favorite")
    public ResponseEntity<Void> toggleFavoriteRestaurant(@PathVariable Long id) {
        User user = userService.getCurrentUser();
        restaurantService.toggleFavoriteRestaurant(id, user);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @GetMapping("/user-favorites")
    public ResponseEntity<List<Restaurant>> getFavoriteRestaurants() {
        User user = userService.getCurrentUser();
        List<Restaurant> favorites = restaurantService.getFavoriteRestaurants(user);
        return new ResponseEntity<>(favorites, HttpStatus.OK);
    }
} 