package com.adi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
        
        User user = userService.findUserProfileByJwt(jwt);
        Restaurant restaurant = restaurantService.createRestaurant(restaurantDto, user);
        
        return new ResponseEntity<>(restaurant, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantService.getAllRestaurants();
        return new ResponseEntity<>(restaurants, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }
    
    @GetMapping("/search/{name}")
    public ResponseEntity<List<Restaurant>> searchRestaurantsByName(@PathVariable String name) {
        List<Restaurant> restaurants = restaurantService.searchRestaurantsByName(name);
        return new ResponseEntity<>(restaurants, HttpStatus.OK);
    }
} 