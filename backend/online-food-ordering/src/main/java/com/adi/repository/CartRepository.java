package com.adi.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adi.model.CartItem;
import com.adi.model.MenuItem;
import com.adi.model.User;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {
    
    Optional<CartItem> findByUserAndMenuItem(User user, MenuItem menuItem);
    
    List<CartItem> findByUser(User user);
    
    List<CartItem> findByUserId(Long userId);
} 