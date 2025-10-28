-- Update Menu Items with Unique Dishes and Images
USE tastetrack_db;

-- Delete existing menu items and restaurants
DELETE FROM menu_items;
DELETE FROM restaurants;

-- Reset auto increment
ALTER TABLE restaurants AUTO_INCREMENT = 1;
ALTER TABLE menu_items AUTO_INCREMENT = 1;

-- Insert restaurants with new images
INSERT INTO restaurants (name, cuisine, rating, delivery_time, min_order, image, address, is_open) VALUES
('Luigi''s Italian Kitchen', 'Italian', 4.5, '25-35 min', 15.00, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', '123 Main St, Downtown', TRUE),
('Tokyo Sushi Bar', 'Japanese', 4.7, '30-40 min', 20.00, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop', '456 Oak Ave, Midtown', TRUE),
('The Burger Joint', 'American', 4.3, '20-30 min', 10.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop', '789 Elm St, Uptown', TRUE),
('Fresh Greens Co.', 'Healthy', 4.6, '15-25 min', 12.00, 'https://images.unsplash.com/photo-1498837167922-ddd27525bf86?w=800&h=600&fit=crop', '321 Pine Rd, Downtown', TRUE);

-- Insert unique menu items with unique images
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
('California Roll', 'Fresh crab, avocado, and cucumber', 9.99, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&h=400&fit=crop', 'Sushi', 2, FALSE, 4.7),
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
('Crispy Chicken Sandwich', 'Fried chicken breast with pickles and mayo', 11.99, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=400&fit=crop', 'Sandwiches', 3, FALSE, 4.5),
('Loaded Fries', 'Crispy fries topped with cheese, bacon, and sour cream', 7.99, 'https://images.unsplash.com/photo-1630431341973-02e1d0f45a0f?w=500&h=400&fit=crop', 'Sides', 3, FALSE, 4.6),
('Onion Rings', 'Golden fried onion rings with ranch dipping sauce', 6.99, 'https://images.unsplash.com/photo-1549007953-411a69591654?w=500&h=400&fit=crop', 'Sides', 3, TRUE, 4.4),

-- Fresh Greens Co. (Restaurant 4) - Healthy dishes
('Caesar Salad', 'Fresh romaine with parmesan and caesar dressing', 8.99, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=400&fit=crop', 'Salads', 4, TRUE, 4.5),
('Greek Salad', 'Tomatoes, cucumber, olives, feta cheese, and olive oil', 9.99, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop', 'Salads', 4, TRUE, 4.6),
('Grilled Chicken Bowl', 'Quinoa, grilled chicken, avocado, and mixed greens', 13.99, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop', 'Bowls', 4, FALSE, 4.7),
('Buddha Bowl', 'Roasted vegetables, chickpeas, quinoa, and tahini dressing', 12.99, 'https://images.unsplash.com/photo-1490645935967-10de6ba17025?w=500&h=400&fit=crop', 'Bowls', 4, TRUE, 4.8),
('Salmon Poke Bowl', 'Fresh salmon, edamame, seaweed, and sushi rice', 15.99, 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=500&h=400&fit=crop', 'Bowls', 4, FALSE, 4.9),
('Green Smoothie', 'Spinach, banana, mango, and almond milk', 6.99, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&h=400&fit=crop', 'Smoothies', 4, TRUE, 4.5),
('Acai Bowl', 'Acai blend topped with granola, berries, and honey', 10.99, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&h=400&fit=crop', 'Bowls', 4, TRUE, 4.7);

