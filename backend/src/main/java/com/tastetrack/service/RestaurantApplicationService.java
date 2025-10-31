package com.tastetrack.service;

import com.tastetrack.dto.ApplicationActionRequest;
import com.tastetrack.dto.RestaurantApplicationRequest;
import com.tastetrack.dto.RestaurantApplicationResponse;
import com.tastetrack.entity.Restaurant;
import com.tastetrack.entity.RestaurantApplication;
import com.tastetrack.entity.User;
import com.tastetrack.repository.RestaurantApplicationRepository;
import com.tastetrack.repository.RestaurantRepository;
import com.tastetrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantApplicationService {
    @Autowired
    private RestaurantApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public RestaurantApplicationResponse submitApplication(RestaurantApplicationRequest request) {
        // Check if email already exists in applications
        if (applicationRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("An application with this email already exists");
        }

        // Check if email already exists in users
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("This email is already registered");
        }

        RestaurantApplication application = new RestaurantApplication();
        application.setName(request.getName());
        application.setEmail(request.getEmail());
        application.setPhone(request.getPhone());
        application.setAddress(request.getAddress());
        application.setDescription(request.getDescription());
        application.setPassword(request.getPassword());
        application.setStatus(RestaurantApplication.ApplicationStatus.PENDING);
        application.setSubmittedAt(LocalDateTime.now());

        application = applicationRepository.save(application);
        return RestaurantApplicationResponse.fromEntity(application);
    }

    public List<RestaurantApplicationResponse> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(RestaurantApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<RestaurantApplicationResponse> getPendingApplications() {
        return applicationRepository.findByStatus(RestaurantApplication.ApplicationStatus.PENDING).stream()
                .map(RestaurantApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public RestaurantApplicationResponse getApplicationById(Long id) {
        RestaurantApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return RestaurantApplicationResponse.fromEntity(application);
    }

    @Transactional
    public RestaurantApplicationResponse approveApplication(Long id, String adminEmail) {
        try {
            System.out.println("=== APPROVING APPLICATION ===");
            System.out.println("Application ID: " + id);
            System.out.println("Admin Email: " + adminEmail);
            
            RestaurantApplication application = applicationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Application not found"));

            System.out.println("Application found: " + application.getName());
            System.out.println("Current status: " + application.getStatus());

            if (application.getStatus() != RestaurantApplication.ApplicationStatus.PENDING) {
                throw new RuntimeException("Application has already been processed");
            }

            // Create vendor user account or update existing user
            System.out.println("Creating/updating vendor user...");
            User vendor = userRepository.findByEmail(application.getEmail()).orElse(null);
            
            if (vendor != null) {
                System.out.println("User with email already exists. Updating to VENDOR role...");
                // If user exists, update their role to VENDOR and password
                vendor.setRole(User.Role.VENDOR);
                vendor.setPhone(application.getPhone());
                // Update password from application
                vendor.setPassword(passwordEncoder.encode(application.getPassword()));
                System.out.println("Updated existing user to VENDOR role with provided password");
            } else {
                System.out.println("Creating new vendor user...");
                // Create new vendor user
                vendor = new User();
                vendor.setFirstName(application.getName().split(" ")[0]);
                vendor.setLastName(application.getName().contains(" ") ? 
                                  application.getName().substring(application.getName().indexOf(" ") + 1) : 
                                  "Restaurant");
                vendor.setEmail(application.getEmail());
                // Use password from application
                vendor.setPassword(passwordEncoder.encode(application.getPassword()));
                System.out.println("Created new vendor account with provided password");
                vendor.setPhone(application.getPhone());
                vendor.setRole(User.Role.VENDOR);
                vendor.setEnabled(true);
            }

            vendor = userRepository.save(vendor);
            System.out.println("Vendor user saved with ID: " + vendor.getId());

            // Create restaurant entry
            System.out.println("Creating restaurant entry...");
            Restaurant restaurant = new Restaurant();
            restaurant.setName(application.getName());
            restaurant.setCuisine("Multi-Cuisine"); // Default, can be updated later
            restaurant.setRating(0.0); // Default rating
            restaurant.setDeliveryTime("30-45 mins"); // Default
            restaurant.setMinOrder(0.0); // Default
            restaurant.setAddress(application.getAddress());
            restaurant.setIsOpen(true);
            restaurant.setOwner(vendor);

            restaurant = restaurantRepository.save(restaurant);
            System.out.println("Restaurant created with ID: " + restaurant.getId());

            // Update application status
            System.out.println("Updating application status...");
            application.setStatus(RestaurantApplication.ApplicationStatus.APPROVED);
            application.setProcessedAt(LocalDateTime.now());
            application.setProcessedBy(adminEmail);

            application = applicationRepository.save(application);
            System.out.println("Application approved successfully");

            // TODO: Send email notification to vendor with login credentials

            return RestaurantApplicationResponse.fromEntity(application);
        } catch (Exception e) {
            System.out.println("Error in approveApplication: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error approving application: " + e.getMessage(), e);
        }
    }

    @Transactional
    public RestaurantApplicationResponse rejectApplication(Long id, String adminEmail, ApplicationActionRequest request) {
        RestaurantApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getStatus() != RestaurantApplication.ApplicationStatus.PENDING) {
            throw new RuntimeException("Application has already been processed");
        }

        application.setStatus(RestaurantApplication.ApplicationStatus.REJECTED);
        application.setProcessedAt(LocalDateTime.now());
        application.setProcessedBy(adminEmail);
        application.setRejectionReason(request.getRejectionReason());

        application = applicationRepository.save(application);

        // TODO: Send email notification to applicant about rejection

        return RestaurantApplicationResponse.fromEntity(application);
    }
}
