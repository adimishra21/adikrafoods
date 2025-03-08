package com.adi.service;

import com.adi.dto.CartItemDto;
import com.adi.model.Cart;
import com.adi.model.CartItem;
import com.adi.model.User;

public interface CartService {
    
    CartItem addItemToCart(CartItemDto cartItemDto, User user);
    
    Cart findUserCart(Long userId);
    
    void removeItemFromCart(Long userId, Long cartItemId);
    
    CartItem updateCartItemQuantity(Long userId, Long cartItemId, int quantity);
    
    void clearCart(Long userId);
    
} 