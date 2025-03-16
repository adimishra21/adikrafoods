package com.adi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adi.dto.CartItemDto;
import com.adi.exception.ResourceNotFoundException;
import com.adi.model.CartItem;
import com.adi.model.MenuItem;
import com.adi.model.User;
import com.adi.repository.CartRepository;
import com.adi.repository.MenuItemRepository;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Override
    public CartItem addItemToCart(CartItemDto cartItemDto, User user) {
        try {
            MenuItem menuItem;
            
            try {
                // First try to find by ID
                menuItem = menuItemRepository.findById(cartItemDto.getMenuItemId())
                    .orElse(null);
                    
                // If not found by ID, try to find by name
                if (menuItem == null && cartItemDto.getName() != null) {
                    menuItem = menuItemRepository.findByName(cartItemDto.getName())
                        .orElse(null);
                }
                
                // If still not found, create a new one
                if (menuItem == null) {
                    throw new ResourceNotFoundException("Menu item not found");
                }
            } catch (Exception e) {
                // If menu item not found, create a new one from the cart item data
                menuItem = cartItemDto.toMenuItem();
                
                // Save the new menu item
                menuItem = menuItemRepository.save(menuItem);
            }
            
            // Check if item already exists in cart
            Optional<CartItem> existingItem = cartRepository.findByUserAndMenuItem(user, menuItem);
            
            if (existingItem.isPresent()) {
                // Update quantity of existing item
                CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + cartItemDto.getQuantity());
                return cartRepository.save(item);
            } else {
                // Create new cart item
                CartItem newItem = new CartItem();
                newItem.setUser(user);
                newItem.setMenuItem(menuItem);
                newItem.setQuantity(cartItemDto.getQuantity());
                newItem.setPrice(menuItem.getPrice());
                return cartRepository.save(newItem);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error adding item to cart: " + e.getMessage(), e);
        }
    }
    
    @Override
    public List<CartItem> getCartItems(User user) {
        return cartRepository.findByUser(user);
    }
    
    @Override
    public void removeCartItem(Long cartItemId, User user) {
        CartItem cartItem = cartRepository.findById(cartItemId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));
        
        if (cartItem.getUser().getId().equals(user.getId())) {
            cartRepository.delete(cartItem);
        } else {
            throw new RuntimeException("You are not authorized to remove this item");
        }
    }
    
    @Override
    public void clearCart(User user) {
        List<CartItem> cartItems = cartRepository.findByUser(user);
        cartRepository.deleteAll(cartItems);
    }
    
    @Override
    public CartItem updateCartItemQuantity(Long cartItemId, Integer quantity, User user) {
        CartItem cartItem = cartRepository.findById(cartItemId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));
        
        if (cartItem.getUser().getId().equals(user.getId())) {
            cartItem.setQuantity(quantity);
            return cartRepository.save(cartItem);
        } else {
            throw new RuntimeException("You are not authorized to update this item");
        }
    }
} 