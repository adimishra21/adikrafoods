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

import com.adi.dto.OrderRequest;
import com.adi.model.Order;
import com.adi.model.User;
import com.adi.service.OrderService;
import com.adi.service.UserService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/")
    public ResponseEntity<Order> createOrder(
            @RequestBody OrderRequest orderRequest,
            @RequestHeader("Authorization") String jwt) {
        
        User user = userService.findUserProfileByJwt(jwt);
        Order order = orderService.createOrder(orderRequest, user);
        
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<Order>> getUserOrders(@RequestHeader("Authorization") String jwt) {
        User user = userService.findUserProfileByJwt(jwt);
        List<Order> orders = orderService.getUserOrders(user.getId());
        
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) {
        
        User user = userService.findUserProfileByJwt(jwt);
        Order order = orderService.getOrderById(orderId);
        
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Order>> getRestaurantOrders(
            @PathVariable Long restaurantId,
            @RequestHeader("Authorization") String jwt) {
        
        User user = userService.findUserProfileByJwt(jwt);
        List<Order> orders = orderService.getRestaurantOrders(restaurantId);
        
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
    
    @PostMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody String status,
            @RequestHeader("Authorization") String jwt) {
        
        User user = userService.findUserProfileByJwt(jwt);
        Order order = orderService.updateOrderStatus(orderId, status);
        
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
} 