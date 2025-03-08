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

import com.adi.dto.FoodDto;
import com.adi.model.Food;
import com.adi.model.Restaurant;
import com.adi.model.User;
import com.adi.service.FoodService;
import com.adi.service.RestaurantService;
import com.adi.service.UserService;

@RestController
@RequestMapping("/api/foods")
public class FoodController {
    
    @Autowired
    private FoodService foodService;
    
    @Autowired
    private RestaurantService restaurantService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/restaurant/{restaurantId}")
    public ResponseEntity<Food> addFoodItem(
            @RequestBody FoodDto foodDto,
            @PathVariable Long restaurantId,
            @RequestHeader("Authorization") String jwt) {
        
        User user = userService.findUserProfileByJwt(jwt);
        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        
        Food food = foodService.addFoodItem(foodDto, restaurant, user);
        
        return new ResponseEntity<>(food, HttpStatus.CREATED);
    }
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Food>> getRestaurantFoods(@PathVariable Long restaurantId) {
        List<Food> foods = foodService.getRestaurantFoods(restaurantId);
        return new ResponseEntity<>(foods, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Food> getFoodById(@PathVariable Long id) {
        Food food = foodService.getFoodById(id);
        return new ResponseEntity<>(food, HttpStatus.OK);
    }
    
    @GetMapping("/search/{name}")
    public ResponseEntity<List<Food>> searchFoodsByName(@PathVariable String name) {
        List<Food> foods = foodService.searchFoodsByName(name);
        return new ResponseEntity<>(foods, HttpStatus.OK);
    }
} 