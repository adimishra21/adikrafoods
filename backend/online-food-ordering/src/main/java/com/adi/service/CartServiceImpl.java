package com.adi.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adi.dto.CartItemDto;
import com.adi.model.Cart;
import com.adi.model.CartItem;
import com.adi.model.Food;
import com.adi.model.User;
import com.adi.repository.CartItemRepository;
import com.adi.repository.CartRepository;
import com.adi.repository.FoodRepository;
import com.adi.repository.UserRepository;

@Service
public class CartServiceImpl implements CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FoodRepository foodRepository;
    
    @Override
    public CartItem addItemToCart(CartItemDto cartItemDto, User user) {
        Cart cart = findUserCart(user.getId());
        
        if (cart == null) {
            cart = new Cart();
            cart.setCustomer(user);
        }
        
        Food food = foodRepository.findById(cartItemDto.getFoodId())
                .orElseThrow(() -> new RuntimeException("Food not found"));
        
        // Check if food is already in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getFood().getId() == food.getId())
                .findFirst();
        
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + cartItemDto.getQuantity());
            return cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setFood(food);
            newItem.setCart(cart);
            newItem.setQuantity(cartItemDto.getQuantity());
            
            cart.getItems().add(newItem);
            cartRepository.save(cart);
            
            return cartItemRepository.save(newItem);
        }
    }
    
    @Override
    public Cart findUserCart(Long userId) {
        return cartRepository.findByCustomerId(userId);
    }
    
    @Override
    public void removeItemFromCart(Long userId, Long cartItemId) {
        Cart cart = findUserCart(userId);
        
        if (cart == null) {
            throw new RuntimeException("Cart not found");
        }
        
        CartItem itemToRemove = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (itemToRemove.getCart().getId() != cart.getId()) {
            throw new RuntimeException("Item does not belong to user's cart");
        }
        
        cart.getItems().remove(itemToRemove);
        cartRepository.save(cart);
        cartItemRepository.delete(itemToRemove);
    }
    
    @Override
    public CartItem updateCartItemQuantity(Long userId, Long cartItemId, int quantity) {
        Cart cart = findUserCart(userId);
        
        if (cart == null) {
            throw new RuntimeException("Cart not found");
        }
        
        CartItem itemToUpdate = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (itemToUpdate.getCart().getId() != cart.getId()) {
            throw new RuntimeException("Item does not belong to user's cart");
        }
        
        itemToUpdate.setQuantity(quantity);
        return cartItemRepository.save(itemToUpdate);
    }
    
    @Override
    public void clearCart(Long userId) {
        Cart cart = findUserCart(userId);
        
        if (cart == null) {
            return;
        }
        
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);
    }
} 