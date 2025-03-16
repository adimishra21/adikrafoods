package com.adi.service;

import java.util.List;

import com.adi.dto.OrderRequest;
import com.adi.model.Order;
import com.adi.model.User;

public interface OrderService {
    
    Order createOrder(OrderRequest orderRequest, User user);
    
    Order getOrderById(Long orderId);
    
    List<Order> getUserOrders(Long userId);
    
    List<Order> getRestaurantOrders(Long restaurantId);
    
    Order updateOrderStatus(Long orderId, String status);
    
} 