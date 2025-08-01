package com.ug.portal.controller;

import com.ug.portal.model.LoginSession;
import com.ug.portal.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private StudentService studentService;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> loginRequest,
            HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String name = loginRequest.get("name");
            String studentId = loginRequest.get("studentId");
            String email = loginRequest.get("email");
            String userType = loginRequest.get("userType");
            
            // Validate required fields
            if (name == null || name.trim().isEmpty() ||
                studentId == null || studentId.trim().isEmpty() ||
                email == null || email.trim().isEmpty()) {
                
                response.put("success", false);
                response.put("message", "Name, Student ID, and Email are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Basic email validation
            if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                response.put("success", false);
                response.put("message", "Please enter a valid email address");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Get client IP and User Agent
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            // Record the login
            LoginSession session = studentService.recordLogin(
                name.trim(), 
                studentId.trim(), 
                email.trim().toLowerCase(), 
                ipAddress, 
                userAgent
            );
            
            // Prepare user data for response
            Map<String, Object> userData = new HashMap<>();
            userData.put("name", name.trim());
            userData.put("studentId", studentId.trim());
            userData.put("email", email.trim().toLowerCase());
            userData.put("userType", "student");
            userData.put("loginTime", session.getLoginTime().toString());
            userData.put("isAdmin", false);
            
            response.put("success", true);
            response.put("userData", userData);
            response.put("message", "Login successful");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Server error occurred during login: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
