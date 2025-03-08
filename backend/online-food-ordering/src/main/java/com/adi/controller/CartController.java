package com.adi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adi.dto.CartItemDto;
import com.adi.model.Cart;
import com.adi.model.CartItem;
import com.adi.model.User;
import com.adi.service.CartService;
import com.adi.service.UserService;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/add")
    public ResponseEntity<CartItem> addItemToCart(
            @RequestBody CartItemDto cartItemDto,
            @RequestHeader("Authorization") String jwt) {
        
        User user = userService.findUserProfileByJwt(jwt);
        CartItem cartItem = cartService.addItemToCart(cartItemDto, user);
        
        return new ResponseEntity<>(cartItem, HttpStatus.CREATED);
    }
    
    @GetMapping("/")
    public ResponseEntity<Cart> findUserCart(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserProfileByJwt(jwt);
        Cart cart = cartService.findUserCart(user.getId());
        
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }
    
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<String> removeItemFromCart(
            @PathVariable Long cartItemId,
            @RequestHeader("Authorization") String jwt) {
        
        User user = userService.findUserProfileByJwt(jwt);
        cartService.removeItemFromCart(user.getId(), cartItemId);
        
        return new ResponseEntity<>("Item removed from cart", HttpStatus.OK);
    }
    
    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItemQuantity(
            @PathVariable Long cartItemId,
            @RequestBody CartItemDto cartItemDto,
            @RequestHeader("Authorization") String jwt) {
        
        User user = userService.findUserProfileByJwt(jwt);
        CartItem updatedCartItem = cartService.updateCartItemQuantity(user.getId(), cartItemId, cartItemDto.getQuantity());
        
        return new ResponseEntity<>(updatedCartItem, HttpStatus.OK);
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserProfileByJwt(jwt);
        cartService.clearCart(user.getId());
        
        return new ResponseEntity<>("Cart cleared", HttpStatus.OK);
    }
} 