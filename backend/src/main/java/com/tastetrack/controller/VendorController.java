package com.tastetrack.controller;

import com.tastetrack.entity.MenuItem;
import com.tastetrack.entity.Order;
import com.tastetrack.entity.Restaurant;
import com.tastetrack.entity.User;
import com.tastetrack.repository.MenuItemRepository;
import com.tastetrack.repository.OrderRepository;
import com.tastetrack.repository.RestaurantRepository;
import com.tastetrack.repository.UserRepository;
import com.tastetrack.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendor")
@CrossOrigin(origins = "*")
public class VendorController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Get the vendor's restaurant details
     */
    @GetMapping("/restaurant")
    public ResponseEntity<?> getVendorRestaurant(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = validateVendorToken(authHeader);
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));

            Restaurant restaurant = restaurantRepository.findByOwner(vendor)
                    .orElseThrow(() -> new RuntimeException("Restaurant not found for this vendor"));

            return ResponseEntity.ok(restaurant);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get all menu items for the vendor's restaurant
     */
    @GetMapping("/menu-items")
    public ResponseEntity<?> getVendorMenuItems(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = validateVendorToken(authHeader);
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));

            Restaurant restaurant = restaurantRepository.findByOwner(vendor)
                    .orElseThrow(() -> new RuntimeException("Restaurant not found for this vendor"));

            List<MenuItem> menuItems = menuItemRepository.findByRestaurantId(restaurant.getId());
            return ResponseEntity.ok(menuItems);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Create a new menu item
     */
    @PostMapping("/menu-items")
    public ResponseEntity<?> createMenuItem(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody MenuItem menuItem) {
        try {
            String email = validateVendorToken(authHeader);
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));

            Restaurant restaurant = restaurantRepository.findByOwner(vendor)
                    .orElseThrow(() -> new RuntimeException("Restaurant not found for this vendor"));

            menuItem.setRestaurant(restaurant);
            MenuItem savedItem = menuItemRepository.save(menuItem);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Menu item created successfully");
            response.put("menuItem", savedItem);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Update a menu item
     */
    @PutMapping("/menu-items/{id}")
    public ResponseEntity<?> updateMenuItem(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody MenuItem menuItemUpdate) {
        try {
            String email = validateVendorToken(authHeader);
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));

            Restaurant restaurant = restaurantRepository.findByOwner(vendor)
                    .orElseThrow(() -> new RuntimeException("Restaurant not found for this vendor"));

            MenuItem existingItem = menuItemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            // Verify the menu item belongs to this vendor's restaurant
            if (!existingItem.getRestaurant().getId().equals(restaurant.getId())) {
                throw new RuntimeException("Unauthorized: This menu item does not belong to your restaurant");
            }

            // Update fields
            existingItem.setName(menuItemUpdate.getName());
            existingItem.setDescription(menuItemUpdate.getDescription());
            existingItem.setPrice(menuItemUpdate.getPrice());
            existingItem.setImage(menuItemUpdate.getImage());
            existingItem.setCategory(menuItemUpdate.getCategory());
            existingItem.setIsVeg(menuItemUpdate.getIsVeg());
            existingItem.setRating(menuItemUpdate.getRating());

            MenuItem updatedItem = menuItemRepository.save(existingItem);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Menu item updated successfully");
            response.put("menuItem", updatedItem);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Delete a menu item
     */
    @DeleteMapping("/menu-items/{id}")
    public ResponseEntity<?> deleteMenuItem(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            String email = validateVendorToken(authHeader);
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));

            Restaurant restaurant = restaurantRepository.findByOwner(vendor)
                    .orElseThrow(() -> new RuntimeException("Restaurant not found for this vendor"));

            MenuItem menuItem = menuItemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            // Verify the menu item belongs to this vendor's restaurant
            if (!menuItem.getRestaurant().getId().equals(restaurant.getId())) {
                throw new RuntimeException("Unauthorized: This menu item does not belong to your restaurant");
            }

            menuItemRepository.delete(menuItem);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Menu item deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get all orders for the vendor's restaurant
     */
    @GetMapping("/orders")
    public ResponseEntity<?> getVendorOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            String email = validateVendorToken(authHeader);
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));

            Restaurant restaurant = restaurantRepository.findByOwner(vendor)
                    .orElseThrow(() -> new RuntimeException("Restaurant not found for this vendor"));

            List<Order> orders = orderRepository.findByRestaurantIdOrderByOrderDateDesc(restaurant.getId());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Update order status
     */
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long orderId,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            String email = validateVendorToken(authHeader);
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));

            Restaurant restaurant = restaurantRepository.findByOwner(vendor)
                    .orElseThrow(() -> new RuntimeException("Restaurant not found for this vendor"));

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            // Verify the order belongs to this vendor's restaurant
            if (!order.getRestaurant().getId().equals(restaurant.getId())) {
                throw new RuntimeException("Unauthorized: This order does not belong to your restaurant");
            }

            String newStatus = statusUpdate.get("status");
            if (newStatus == null || newStatus.isEmpty()) {
                throw new RuntimeException("Status is required");
            }

            order.setStatus(Order.OrderStatus.valueOf(newStatus));
            Order updatedOrder = orderRepository.save(order);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order status updated successfully");
            response.put("order", updatedOrder);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid order status");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Update restaurant details
     */
    @PutMapping("/restaurant")
    public ResponseEntity<?> updateRestaurant(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Restaurant restaurantUpdate) {
        try {
            String email = validateVendorToken(authHeader);
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));

            Restaurant restaurant = restaurantRepository.findByOwner(vendor)
                    .orElseThrow(() -> new RuntimeException("Restaurant not found for this vendor"));

            // Update allowed fields
            restaurant.setName(restaurantUpdate.getName());
            restaurant.setCuisine(restaurantUpdate.getCuisine());
            restaurant.setAddress(restaurantUpdate.getAddress());
            restaurant.setDeliveryTime(restaurantUpdate.getDeliveryTime());
            restaurant.setMinOrder(restaurantUpdate.getMinOrder());
            restaurant.setImage(restaurantUpdate.getImage());
            restaurant.setIsOpen(restaurantUpdate.getIsOpen());

            Restaurant updatedRestaurant = restaurantRepository.save(restaurant);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Restaurant updated successfully");
            response.put("restaurant", updatedRestaurant);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Validate vendor token and return email
     */
    private String validateVendorToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        String email = jwtUtil.getEmailFromToken(token);
        String role = jwtUtil.getRoleFromToken(token);

        if (!"VENDOR".equals(role)) {
            throw new RuntimeException("Access denied. Vendor privileges required.");
        }

        return email;
    }
}
