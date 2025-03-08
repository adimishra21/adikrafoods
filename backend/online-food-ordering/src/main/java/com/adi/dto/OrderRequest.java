package com.adi.dto;

public class OrderRequest {
    
    private Long restaurantId;
    private Long deliveryAddressId;
    
    public OrderRequest() {
    }
    
    public Long getRestaurantId() {
        return restaurantId;
    }
    
    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }
    
    public Long getDeliveryAddressId() {
        return deliveryAddressId;
    }
    
    public void setDeliveryAddressId(Long deliveryAddressId) {
        this.deliveryAddressId = deliveryAddressId;
    }
} 