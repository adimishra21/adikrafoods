package com.adi.service;

import com.adi.model.User;

public interface UserService {
    
    public User findUserProfileByJwt(String jwt);
    
    public User saveUser(User user);
    
    User getUserById(Long id);
    
    User getUserByEmail(String email);
    
    User getCurrentUser();
} 