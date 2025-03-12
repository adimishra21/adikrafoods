package com.adi.service;

import java.util.List;

import com.adi.model.MenuItem;
import com.adi.model.User;

public interface MenuItemService {
    
    List<MenuItem> getMenuItemsByRestaurant(Long restaurantId);
    
    MenuItem getMenuItemById(Long id);
    
    MenuItem createMenuItem(Long restaurantId, MenuItem menuItem, User user);
    
    MenuItem updateMenuItem(Long restaurantId, Long id, MenuItem menuItem, User user);
    
    void deleteMenuItem(Long restaurantId, Long id, User user);
    
} 