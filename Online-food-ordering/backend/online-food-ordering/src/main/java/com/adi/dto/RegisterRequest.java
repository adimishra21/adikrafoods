package com.adi.dto;

import com.adi.model.USER_ROLE;

public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private USER_ROLE role;
    
    public RegisterRequest() {
        // Default constructor
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public USER_ROLE getRole() {
        return role;
    }
    
    public void setRole(USER_ROLE role) {
        this.role = role;
    }
} 