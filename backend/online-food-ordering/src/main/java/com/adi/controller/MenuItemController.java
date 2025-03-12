package com.adi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adi.model.MenuItem;
import com.adi.model.User;
import com.adi.service.MenuItemService;
import com.adi.service.UserService;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/menu-items")
public class MenuItemController {
    
    @Autowired
    private MenuItemService menuItemService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<MenuItem>> getMenuItemsByRestaurant(@PathVariable Long restaurantId) {
        try {
            List<MenuItem> menuItems = menuItemService.getMenuItemsByRestaurant(restaurantId);
            return new ResponseEntity<>(menuItems, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(
            @PathVariable Long restaurantId, 
            @PathVariable Long id) {
        try {
            MenuItem menuItem = menuItemService.getMenuItemById(id);
            return new ResponseEntity<>(menuItem, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createMenuItem(
            @PathVariable Long restaurantId, 
            @RequestBody MenuItem menuItem) {
        try {
            System.out.println("Received menu item: " + menuItem);
            User user = userService.getCurrentUser();
            MenuItem createdMenuItem = menuItemService.createMenuItem(restaurantId, menuItem, user);
            return new ResponseEntity<>(createdMenuItem, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new ErrorResponse("Failed to create menu item: " + e.getMessage()), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenuItem(
            @PathVariable Long restaurantId, 
            @PathVariable Long id, 
            @RequestBody MenuItem menuItem) {
        try {
            User user = userService.getCurrentUser();
            MenuItem updatedMenuItem = menuItemService.updateMenuItem(restaurantId, id, menuItem, user);
            return new ResponseEntity<>(updatedMenuItem, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new ErrorResponse("Failed to update menu item: " + e.getMessage()), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(
            @PathVariable Long restaurantId, 
            @PathVariable Long id) {
        try {
            User user = userService.getCurrentUser();
            menuItemService.deleteMenuItem(restaurantId, id, user);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new ErrorResponse("Failed to delete menu item: " + e.getMessage()), 
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        e.printStackTrace();
        return new ResponseEntity<>(
                new ErrorResponse("An error occurred: " + e.getMessage()), 
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    // Simple error response class
    private static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
} 