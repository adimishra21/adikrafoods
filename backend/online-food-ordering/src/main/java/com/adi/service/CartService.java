package com.adi.service;

import java.util.List;

import com.adi.dto.CartItemDto;
import com.adi.model.CartItem;
import com.adi.model.User;

public interface CartService {
    CartItem addItemToCart(CartItemDto cartItemDto, User user);
    List<CartItem> getCartItems(User user);
    void removeCartItem(Long cartItemId, User user);
    void clearCart(User user);
    CartItem updateCartItemQuantity(Long cartItemId, Integer quantity, User user);
} 