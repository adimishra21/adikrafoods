package com.adi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adi.model.Cart;
import com.adi.model.User;

@Repository
public interface CartEntityRepository extends JpaRepository<Cart, Long> {
    
    Cart findByCustomerId(Long customerId);
    
    Cart findByCustomer(User customer);
} 