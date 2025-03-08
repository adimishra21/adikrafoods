package com.adi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adi.model.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    
} 