-- Taste Track Database Schema
-- MySQL Database Schema for Food Ordering System

CREATE DATABASE IF NOT EXISTS tastetrack_db;
USE tastetrack_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cuisine VARCHAR(50) NOT NULL,
    rating DECIMAL(3,2) NOT NULL,
    delivery_time VARCHAR(20) NOT NULL,
    min_order DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    address VARCHAR(255) NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    restaurant_id BIGINT NOT NULL,
    is_veg BOOLEAN NOT NULL DEFAULT FALSE,
    rating DECIMAL(3,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    delivery_address VARCHAR(255) NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estimated_delivery TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    payment_method ENUM('CARD', 'WALLET', 'CASH_ON_DELIVERY') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    payment_date TIMESTAMP,
    transaction_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address VARCHAR(255) NOT NULL,
    delivery_city VARCHAR(50) NOT NULL,
    delivery_state VARCHAR(50) NOT NULL,
    delivery_zip VARCHAR(10) NOT NULL,
    delivery_instructions VARCHAR(500),
    delivery_date TIMESTAMP,
    status ENUM('PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES
('John', 'Doe', 'john.doe@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK7EnQW', '+1 (555) 123-4567', 'CUSTOMER'),
('Jane', 'Smith', 'admin@tastetrack.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK7EnQW', '+1 (555) 234-5678', 'ADMIN');

-- Password for both users is: password

INSERT INTO restaurants (name, cuisine, rating, delivery_time, min_order, image, address, is_open) VALUES
('Luigi''s Italian Kitchen', 'Italian', 4.5, '25-35 min', 15.00, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', '123 Main St, Downtown', TRUE),
('Tokyo Sushi Bar', 'Japanese', 4.7, '30-40 min', 20.00, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop', '456 Oak Ave, Midtown', TRUE),
('The Burger Joint', 'American', 4.3, '20-30 min', 10.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop', '789 Elm St, Uptown', TRUE),
('Fresh Greens Co.', 'Healthy', 4.6, '15-25 min', 12.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop', '321 Pine Rd, Downtown', TRUE);

INSERT INTO menu_items (name, description, price, image, category, restaurant_id, is_veg, rating) VALUES
-- Luigi's Italian Kitchen (Restaurant 1) - Italian dishes
('Margherita Pizza', 'Classic pizza with fresh mozzarella, tomato sauce, and basil', 12.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop', 'Pizza', 1, TRUE, 4.5),
('Pepperoni Pizza', 'Traditional pepperoni with mozzarella cheese', 14.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop', 'Pizza', 1, FALSE, 4.6),
('Quattro Formaggi Pizza', 'Four cheese pizza with mozzarella, gorgonzola, parmesan, and ricotta', 15.99, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=400&fit=crop', 'Pizza', 1, TRUE, 4.7),
('Spaghetti Carbonara', 'Creamy pasta with pancetta, eggs, and parmesan', 13.99, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&h=400&fit=crop', 'Pasta', 1, FALSE, 4.8),
('Fettuccine Alfredo', 'Rich and creamy fettuccine with parmesan sauce', 12.99, 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&h=400&fit=crop', 'Pasta', 1, TRUE, 4.6),
('Lasagna Bolognese', 'Layered pasta with meat sauce, béchamel, and cheese', 16.99, 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&h=400&fit=crop', 'Pasta', 1, FALSE, 4.9),
('Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone', 7.99, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop', 'Desserts', 1, TRUE, 4.8),

-- Tokyo Sushi Bar (Restaurant 2) - Japanese dishes
('California Roll', 'Fresh crab, avocado, and cucumber', 9.99, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=400&fit=crop', 'Sushi', 2, FALSE, 4.7),
('Salmon Nigiri', 'Premium salmon over seasoned rice', 11.99, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&h=400&fit=crop', 'Sushi', 2, FALSE, 4.8),
('Spicy Tuna Roll', 'Fresh tuna with spicy mayo and cucumber', 12.99, 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=500&h=400&fit=crop', 'Sushi', 2, FALSE, 4.6),
('Dragon Roll', 'Eel, cucumber, topped with avocado and eel sauce', 14.99, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&h=400&fit=crop', 'Sushi', 2, FALSE, 4.9),
('Chicken Teriyaki', 'Grilled chicken with teriyaki sauce, served with rice', 13.99, 'https://images.unsplash.com/photo-1606557187441-48b929a2a0b2?w=500&h=400&fit=crop', 'Entrees', 2, FALSE, 4.5),
('Beef Ramen', 'Rich broth with tender beef, noodles, and soft-boiled egg', 14.99, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop', 'Ramen', 2, FALSE, 4.8),
('Vegetable Tempura', 'Lightly battered and fried seasonal vegetables', 10.99, 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500&h=400&fit=crop', 'Appetizers', 2, TRUE, 4.4),

-- The Burger Joint (Restaurant 3) - American dishes
('Classic Burger', 'Beef patty with lettuce, tomato, and special sauce', 10.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop', 'Burgers', 3, FALSE, 4.4),
('Bacon Cheeseburger', 'Double beef patty with crispy bacon and cheddar cheese', 13.99, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&h=400&fit=crop', 'Burgers', 3, FALSE, 4.7),
('Veggie Burger', 'Plant-based patty with avocado and fresh veggies', 11.99, 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&h=400&fit=crop', 'Burgers', 3, TRUE, 4.3),
('BBQ Pulled Pork Burger', 'Slow-cooked pulled pork with BBQ sauce and coleslaw', 12.99, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=400&fit=crop', 'Burgers', 3, FALSE, 4.6),
('Crispy Chicken Sandwich', 'Fried chicken breast with pickles and mayo', 11.99, 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=500&h=400&fit=crop', 'Sandwiches', 3, FALSE, 4.5),
('Loaded Fries', 'Crispy fries topped with cheese, bacon, and sour cream', 7.99, 'https://images.unsplash.com/photo-1630431341973-02e1d0f45a0f?w=500&h=400&fit=crop', 'Sides', 3, FALSE, 4.6),
('Onion Rings', 'Golden fried onion rings with ranch dipping sauce', 6.99, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=400&fit=crop', 'Sides', 3, TRUE, 4.4),

-- Fresh Greens Co. (Restaurant 4) - Healthy dishes
('Caesar Salad', 'Fresh romaine with parmesan and caesar dressing', 8.99, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=400&fit=crop', 'Salads', 4, TRUE, 4.5),
('Greek Salad', 'Tomatoes, cucumber, olives, feta cheese, and olive oil', 9.99, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop', 'Salads', 4, TRUE, 4.6),
('Grilled Chicken Bowl', 'Quinoa, grilled chicken, avocado, and mixed greens', 13.99, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop', 'Bowls', 4, FALSE, 4.7),
('Buddha Bowl', 'Roasted vegetables, chickpeas, quinoa, and tahini dressing', 12.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop', 'Bowls', 4, TRUE, 4.8),
('Salmon Poke Bowl', 'Fresh salmon, edamame, seaweed, and sushi rice', 15.99, 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=500&h=400&fit=crop', 'Bowls', 4, FALSE, 4.9),
('Green Smoothie', 'Spinach, banana, mango, and almond milk', 6.99, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&h=400&fit=crop', 'Smoothies', 4, TRUE, 4.5),
('Acai Bowl', 'Acai blend topped with granola, berries, and honey', 10.99, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&h=400&fit=crop', 'Bowls', 4, TRUE, 4.7);

CREATE INDEX idx_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_user_id ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_date ON orders(order_date);
