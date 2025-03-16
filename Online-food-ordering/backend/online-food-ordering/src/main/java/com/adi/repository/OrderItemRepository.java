package com.adi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adi.model.Orderitem;

@Repository
public interface OrderItemRepository extends JpaRepository<Orderitem, Long> {
    
} 