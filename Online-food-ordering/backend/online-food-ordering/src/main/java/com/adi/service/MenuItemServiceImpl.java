package com.adi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adi.model.MenuItem;
import com.adi.model.Restaurant;
import com.adi.model.USER_ROLE;
import com.adi.model.User;
import com.adi.repository.MenuItemRepository;
import com.adi.repository.RestaurantRepository;

@Service
public class MenuItemServiceImpl implements MenuItemService {
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Override
    public List<MenuItem> getMenuItemsByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }
    
    @Override
    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
    }
    
    @Override
    public MenuItem createMenuItem(Long restaurantId, MenuItem menuItem, User user) {
        if (!user.getRole().equals(USER_ROLE.ROLE_RESTAURANT_OWNER)) {
            throw new RuntimeException("Only restaurant owners can create menu items");
        }
        
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        
        if (!restaurant.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You can only add menu items to your own restaurants");
        }
        
        menuItem.setRestaurant(restaurant);
        return menuItemRepository.save(menuItem);
    }
    
    @Override
    public MenuItem updateMenuItem(Long restaurantId, Long id, MenuItem updatedMenuItem, User user) {
        if (!user.getRole().equals(USER_ROLE.ROLE_RESTAURANT_OWNER)) {
            throw new RuntimeException("Only restaurant owners can update menu items");
        }
        
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        
        if (!restaurant.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You can only update menu items in your own restaurants");
        }
        
        MenuItem existingMenuItem = getMenuItemById(id);
        
        if (!existingMenuItem.getRestaurant().getId().equals(restaurantId)) {
            throw new RuntimeException("Menu item does not belong to the specified restaurant");
        }
        
        existingMenuItem.setName(updatedMenuItem.getName());
        existingMenuItem.setDescription(updatedMenuItem.getDescription());
        existingMenuItem.setPrice(updatedMenuItem.getPrice());
        existingMenuItem.setImageUrl(updatedMenuItem.getImageUrl());
        if (updatedMenuItem.getIsVeg() != null) {
            existingMenuItem.setIsVeg(updatedMenuItem.getIsVeg());
        }
        
        return menuItemRepository.save(existingMenuItem);
    }
    
    @Override
    public void deleteMenuItem(Long restaurantId, Long id, User user) {
        if (!user.getRole().equals(USER_ROLE.ROLE_RESTAURANT_OWNER)) {
            throw new RuntimeException("Only restaurant owners can delete menu items");
        }
        
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        
        if (!restaurant.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete menu items from your own restaurants");
        }
        
        MenuItem menuItem = getMenuItemById(id);
        
        if (!menuItem.getRestaurant().getId().equals(restaurantId)) {
            throw new RuntimeException("Menu item does not belong to the specified restaurant");
        }
        
        menuItemRepository.delete(menuItem);
    }
} 