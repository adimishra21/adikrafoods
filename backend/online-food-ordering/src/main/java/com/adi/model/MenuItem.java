package com.adi.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "menu_item")
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    private Double price;
    
    @Column(length = 1000)
    private String imageUrl;
    
    @Column(name = "vegetarian")
    private Boolean isVeg;
    
    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;
    
    // Helper method to set category from string
    public void setCategoryFromString(String categoryStr) {
        try {
            if (categoryStr != null && !categoryStr.isEmpty()) {
                this.category = Category.valueOf(categoryStr);
            }
        } catch (IllegalArgumentException e) {
            // Default to MAIN_COURSE if invalid
            this.category = Category.MAIN_COURSE;
        }
    }
    
    @Enumerated(EnumType.STRING)
    private Category category;
    
    public enum Category {
        APPETIZER, MAIN_COURSE, DESSERT, BEVERAGE, SIDE_DISH
    }
} 