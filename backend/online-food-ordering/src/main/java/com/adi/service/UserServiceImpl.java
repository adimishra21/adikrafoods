package com.adi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.adi.config.JwtProvider;
import com.adi.model.User;
import com.adi.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtProvider jwtProvider;
    
    @Override
    public User findUserProfileByJwt(String jwt) {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        
        User user = userRepository.findByEmail(email);
        
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        
        return user;
    }
} 