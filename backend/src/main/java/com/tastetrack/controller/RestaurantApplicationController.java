package com.tastetrack.controller;

import com.tastetrack.dto.ApplicationActionRequest;
import com.tastetrack.dto.RestaurantApplicationRequest;
import com.tastetrack.dto.RestaurantApplicationResponse;
import com.tastetrack.service.RestaurantApplicationService;
import com.tastetrack.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RestaurantApplicationController {
    @Autowired
    private RestaurantApplicationService applicationService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Public endpoint - Anyone can submit a restaurant application
     */
    @PostMapping("/applyRestaurant")
    public ResponseEntity<?> submitApplication(@Valid @RequestBody RestaurantApplicationRequest request) {
        try {
            RestaurantApplicationResponse response = applicationService.submitApplication(request);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Your application has been submitted successfully. We will review it and get back to you soon.");
            result.put("application", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Admin endpoint - Get all applications
     */
    @GetMapping("/admin/applications")
    public ResponseEntity<?> getAllApplications(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            validateAdminToken(token);
            List<RestaurantApplicationResponse> applications = applicationService.getAllApplications();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Admin endpoint - Get pending applications
     */
    @GetMapping("/admin/applications/pending")
    public ResponseEntity<?> getPendingApplications(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            validateAdminToken(token);
            List<RestaurantApplicationResponse> applications = applicationService.getPendingApplications();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Admin endpoint - Get application by ID
     */
    @GetMapping("/admin/applications/{id}")
    public ResponseEntity<?> getApplicationById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            validateAdminToken(token);
            RestaurantApplicationResponse application = applicationService.getApplicationById(id);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Admin endpoint - Approve application
     */
    @PostMapping("/admin/applications/{id}/approve")
    public ResponseEntity<?> approveApplication(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String token) {
        System.out.println("=== APPROVE APPLICATION REQUEST ===");
        System.out.println("Application ID: " + id);
        System.out.println("Authorization header received: " + (token != null ? "YES" : "NO"));
        try {
            String email = validateAdminToken(token);
            System.out.println("Admin email validated: " + email);
            RestaurantApplicationResponse response = applicationService.approveApplication(id, email);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Application approved successfully. Vendor account has been created.");
            result.put("application", response);
            System.out.println("Application approved successfully");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println("Error approving application: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Admin endpoint - Reject application
     */
    @PostMapping("/admin/applications/{id}/reject")
    public ResponseEntity<?> rejectApplication(
            @PathVariable Long id,
            @RequestBody ApplicationActionRequest request,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String email = validateAdminToken(token);
            RestaurantApplicationResponse response = applicationService.rejectApplication(id, email, request);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Application rejected successfully.");
            result.put("application", response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    private String validateAdminToken(String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("Invalid authorization header: " + authHeader);
                throw new RuntimeException("Invalid authorization header");
            }
            
            String token = authHeader.substring(7);
            System.out.println("Extracted token: " + token.substring(0, Math.min(20, token.length())) + "...");
            
            if (!jwtUtil.validateToken(token)) {
                System.out.println("Token validation failed");
                throw new RuntimeException("Invalid or expired token");
            }
            
            String email = jwtUtil.getEmailFromToken(token);
            String role = jwtUtil.getRoleFromToken(token);
            
            System.out.println("Token validated - Email: " + email + ", Role: " + role);
            
            if (!"ADMIN".equals(role)) {
                System.out.println("Access denied - Role is not ADMIN: " + role);
                throw new RuntimeException("Access denied. Admin privileges required.");
            }
            
            return email;
        } catch (Exception e) {
            System.out.println("Token validation error: " + e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
