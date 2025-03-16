package com.adi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adi.config.JwtProvider;
import com.adi.dto.AuthResponse;
import com.adi.dto.LoginRequest;
import com.adi.dto.RegisterRequest;
import com.adi.model.USER_ROLE;
import com.adi.model.User;
import com.adi.repository.UserRepository;
import com.adi.service.CustomerUserDetailsService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtProvider jwtProvider;
    
    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody RegisterRequest request) {
        
        String email = request.getEmail();
        String password = request.getPassword();
        String fullName = request.getFullName();
        USER_ROLE role = request.getRole() != null ? request.getRole() : USER_ROLE.ROLE_CUSTOMER;
        
        User existingUser = userRepository.findByEmail(email);
        
        if (existingUser != null) {
            throw new BadCredentialsException("Email already registered");
        }
        
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setFullname(fullName);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(role);
        
        User savedUser = userRepository.save(newUser);
        
        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String token = jwtProvider.generateToken(authentication);
        
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Registration successful");
        authResponse.setRole(savedUser.getRole());
        authResponse.setFullName(savedUser.getFullname());
        
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }
    
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest request) {
        try {
            System.out.println("AuthController - Login attempt for email: " + request.getEmail());
            
            String email = request.getEmail();
            String password = request.getPassword();
            
            Authentication authentication = authenticate(email, password);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            System.out.println("AuthController - Authentication successful for: " + email);
            System.out.println("AuthController - User authorities: " + authentication.getAuthorities());
            
            String token = jwtProvider.generateToken(authentication);
            System.out.println("AuthController - JWT token generated: " + token.substring(0, 20) + "...");
            
            UserDetails userDetails = customerUserDetailsService.loadUserByUsername(email);
            User user = userRepository.findByEmail(email);
            
            AuthResponse authResponse = new AuthResponse();
            authResponse.setJwt(token);
            authResponse.setMessage("Login successful");
            authResponse.setRole(user.getRole());
            authResponse.setFullName(user.getFullname());
            
            System.out.println("AuthController - Login successful for user: " + user.getFullname() + " with role: " + user.getRole());
            
            return new ResponseEntity<>(authResponse, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("AuthController - Login failed: " + e.getMessage());
            throw e;
        }
    }
    
    private Authentication authenticate(String email, String password) {
        try {
            UserDetails userDetails = customerUserDetailsService.loadUserByUsername(email);
            
            if (userDetails == null) {
                System.err.println("AuthController - Authentication failed: User not found for email: " + email);
                throw new BadCredentialsException("Invalid email");
            }
            
            if (!passwordEncoder.matches(password, userDetails.getPassword())) {
                System.err.println("AuthController - Authentication failed: Invalid password for email: " + email);
                throw new BadCredentialsException("Invalid password");
            }
            
            System.out.println("AuthController - Password validated for user: " + email);
            return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        } catch (Exception e) {
            System.err.println("AuthController - Authentication error: " + e.getMessage());
            throw e;
        }
    }
} 