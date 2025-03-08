package com.adi.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adi.dto.OrderRequest;
import com.adi.model.Address;
import com.adi.model.Cart;
import com.adi.model.CartItem;
import com.adi.model.Order;
import com.adi.model.Orderitem;
import com.adi.model.Restaurant;
import com.adi.model.User;
import com.adi.repository.AddressRepository;
import com.adi.repository.OrderItemRepository;
import com.adi.repository.OrderRepository;
import com.adi.repository.RestaurantRepository;

@Service
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private AddressRepository addressRepository;
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private CartService cartService;
    
    @Override
    public Order createOrder(OrderRequest orderRequest, User user) {
        Restaurant restaurant = restaurantRepository.findById(orderRequest.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        
        Address deliveryAddress = addressRepository.findById(orderRequest.getDeliveryAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        Cart cart = cartService.findUserCart(user.getId());
        
        if (cart == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        Order order = new Order();
        order.setCustomer(user);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(deliveryAddress);
        order.setCreatedAt(new Date());
        order.setStatus("PLACED");
        
        // Calculate total price
        double totalPrice = cart.getItems().stream()
                .mapToDouble(item -> item.getFood().getPrice() * item.getQuantity())
                .sum();
        
        order.setTotalPrice(totalPrice);
        
        Order savedOrder = orderRepository.save(order);
        
        // Create order items from cart items
        List<Orderitem> orderItems = cart.getItems().stream()
                .map(cartItem -> {
                    Orderitem orderItem = new Orderitem();
                    orderItem.setFood(cartItem.getFood());
                    orderItem.setOrder(savedOrder);
                    orderItem.setQuantity(cartItem.getQuantity());
                    return orderItemRepository.save(orderItem);
                })
                .collect(Collectors.toList());
        
        savedOrder.setItems(orderItems);
        
        // Clear the cart
        cartService.clearCart(user.getId());
        
        return savedOrder;
    }
    
    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
    
    @Override
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByCustomerId(userId);
    }
    
    @Override
    public List<Order> getRestaurantOrders(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }
    
    @Override
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        
        return orderRepository.save(order);
    }
} 