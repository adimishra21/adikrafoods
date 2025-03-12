package com.adi.dto;

import com.adi.model.MenuItem;
import lombok.Data;

@Data
public class CartItemDto {
    private Long menuItemId;
    private Long restaurantId;
    private Integer quantity;
    private String name;
    private Double price;
    private String imageUrl;
    private Boolean isVeg;
    
    /**
     * Creates a new MenuItem from this DTO
     * @return a new MenuItem with data from this DTO
     */
    public MenuItem toMenuItem() {
        MenuItem menuItem = new MenuItem();
        menuItem.setName(this.name);
        menuItem.setPrice(this.price);
        menuItem.setImageUrl(this.imageUrl);
        menuItem.setIsVeg(this.isVeg);
        menuItem.setDescription("Added from cart");
        return menuItem;
    }
} 