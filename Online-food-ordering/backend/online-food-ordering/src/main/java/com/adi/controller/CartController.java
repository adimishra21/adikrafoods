package com.adi.controller;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.adi.dto.CartItemDto;
import com.adi.exception.ResourceNotFoundException;
import com.adi.model.CartItem;
import com.adi.model.User;
import com.adi.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartItem> addItemToCart(
            @RequestBody CartItemDto cartItemDto,
            @AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                throw new IllegalStateException("User not authenticated. Please log in to add items to your cart.");
            }
            
            if (cartItemDto.getMenuItemId() == null) {
                throw new IllegalArgumentException("menuItemId is required");
            }
            
            // Log the request data for debugging
            System.out.println("Adding to cart: " + cartItemDto);
            System.out.println("User: " + user.getEmail());
            
            CartItem cartItem = cartService.addItemToCart(cartItemDto, user);
            return new ResponseEntity<>(cartItem, HttpStatus.CREATED);
        } catch (Exception e) {
            // Log the full exception for debugging
            System.err.println("Error in addItemToCart: " + e.getMessage());
            e.printStackTrace();
            throw e; // Let the exception handler handle it
        }
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCartItems(@AuthenticationPrincipal User user) {
        List<CartItem> cartItems = cartService.getCartItems(user);
        return new ResponseEntity<>(cartItems, HttpStatus.OK);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal User user) {
        cartService.removeCartItem(cartItemId, user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItemQuantity(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal User user) {
        CartItem cartItem = cartService.updateCartItemQuantity(cartItemId, quantity, user);
        return new ResponseEntity<>(cartItem, HttpStatus.OK);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleExceptions(Exception e) {
        Map<String, String> errorResponse = new HashMap<>();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        
        if (e instanceof ResourceNotFoundException) {
            status = HttpStatus.NOT_FOUND;
            errorResponse.put("message", e.getMessage());
        } else if (e instanceof IllegalArgumentException) {
            status = HttpStatus.BAD_REQUEST;
            errorResponse.put("message", e.getMessage());
        } else if (e instanceof IllegalStateException) {
            status = HttpStatus.UNAUTHORIZED;
            errorResponse.put("message", e.getMessage());
        } else {
            errorResponse.put("message", "An error occurred: " + e.getMessage());
        }
        
        return new ResponseEntity<>(errorResponse, status);
    }
} 