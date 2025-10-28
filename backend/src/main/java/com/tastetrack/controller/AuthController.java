package com.tastetrack.controller;

import com.tastetrack.dto.AuthResponse;
import com.tastetrack.dto.LoginRequest;
import com.tastetrack.dto.SignupRequest;
import com.tastetrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        try {
            AuthResponse response = userService.signup(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/test-password")
    public ResponseEntity<Map<String, String>> testPassword(@RequestParam String password) {
        Map<String, String> result = new HashMap<>();
        String encoded = passwordEncoder.encode(password);
        result.put("plainPassword", password);
        result.put("encodedPassword", encoded);
        result.put("matches", String.valueOf(passwordEncoder.matches(password, encoded)));
        return ResponseEntity.ok(result);
    }
}
