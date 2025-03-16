package com.adi.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

public class JwtTokenValidator extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = request.getHeader(JwtConstant.JWT_HEADER);
            String requestURI = request.getRequestURI();
            String method = request.getMethod();
            
            System.out.println("JwtTokenValidator - Processing " + method + " request for: " + requestURI);
            System.out.println("JwtTokenValidator - JWT Header: " + (jwt != null ? "present" : "not present"));
            
            // Skip validation for public endpoints
            if (isPublicEndpoint(requestURI)) {
                System.out.println("JwtTokenValidator - Skipping validation for public endpoint: " + requestURI);
                filterChain.doFilter(request, response);
                return;
            }

            if (jwt != null) {
                // Remove "Bearer " prefix
                if (jwt.startsWith("Bearer ")) {
                    jwt = jwt.substring(7);
                    System.out.println("JwtTokenValidator - Bearer prefix removed from token");
                } else {
                    System.out.println("JwtTokenValidator - WARNING: JWT doesn't start with 'Bearer ' prefix");
                }

                try {
                    SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
                    System.out.println("JwtTokenValidator - Created secret key for token validation");
                    
                    Claims claims = Jwts.parserBuilder()
                            .setSigningKey(key)
                            .build()
                            .parseClaimsJws(jwt)
                            .getBody();

                    String email = String.valueOf(claims.get("email"));
                    String authorities = String.valueOf((claims.get("authorities")));
                    
                    System.out.println("JwtTokenValidator - Successfully parsed JWT for user: " + email);
                    System.out.println("JwtTokenValidator - User authorities: " + authorities);

                    List<GrantedAuthority> auth = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);
                    Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auth);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    System.out.println("JwtTokenValidator - Authentication set in SecurityContext for user: " + email);
                } catch (ExpiredJwtException e) {
                    System.err.println("JwtTokenValidator - Token expired: " + e.getMessage());
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"message\":\"JWT token has expired\"}");
                    return;
                } catch (UnsupportedJwtException e) {
                    System.err.println("JwtTokenValidator - Unsupported JWT: " + e.getMessage());
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"message\":\"Unsupported JWT token\"}");
                    return;
                } catch (MalformedJwtException e) {
                    System.err.println("JwtTokenValidator - Malformed JWT: " + e.getMessage());
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"message\":\"Malformed JWT token\"}");
                    return;
                } catch (SignatureException e) {
                    System.err.println("JwtTokenValidator - Invalid signature: " + e.getMessage());
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"message\":\"Invalid JWT signature\"}");
                    return;
                } catch (Exception e) {
                    System.err.println("JwtTokenValidator - Error parsing JWT: " + e.getMessage());
                    e.printStackTrace();
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"message\":\"Invalid token: " + e.getMessage() + "\"}");
                    return;
                }
            } else {
                System.out.println("JwtTokenValidator - No JWT found in request header for: " + requestURI);
                
                // For secured endpoints, check if authentication is required
                if (isSecuredEndpoint(requestURI)) {
                    System.out.println("JwtTokenValidator - Authentication required for secured endpoint: " + requestURI);
                    
                    // Let Spring Security handle the authentication failure
                    SecurityContextHolder.clearContext();
                    
                    // Only return 401 for API endpoints that require authentication
                    if (requestURI.startsWith("/api/")) {
                        System.out.println("JwtTokenValidator - Returning 401 for API endpoint: " + requestURI);
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.getWriter().write("{\"message\":\"Authentication required\"}");
                        return;
                    }
                }
            }
            
            // Check current authentication state
            Authentication existingAuth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("JwtTokenValidator - After processing, authentication is: " + 
                              (existingAuth != null ? "authenticated as " + existingAuth.getName() : "not authenticated"));
            
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            System.err.println("JwtTokenValidator - Unexpected error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    private boolean isPublicEndpoint(String uri) {
        return uri.equals("/") || 
               uri.startsWith("/auth/") || 
               uri.equals("/error") ||
               uri.matches(".*\\.(js|css|html|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$");
    }
    
    private boolean isSecuredEndpoint(String uri) {
        return uri.startsWith("/api/cart") || 
               uri.startsWith("/api/user") || 
               uri.startsWith("/api/orders") ||
               uri.startsWith("/api/restaurants/*/favorite") ||
               uri.startsWith("/api/admin");
    }
}
