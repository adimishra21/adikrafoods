package com.adi.service;

import com.adi.model.User;

public interface UserService {
    
    public User findUserProfileByJwt(String jwt);
    
} 