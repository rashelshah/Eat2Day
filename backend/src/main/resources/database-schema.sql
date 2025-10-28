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
    image VARCHAR(2048),
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
    image VARCHAR(2048),
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
('Jane', 'Smith', 'admin@eat2day.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK7EnQW', '+1 (555) 234-5678', 'ADMIN');

-- Password for both users is: password

INSERT INTO restaurants (id, name, cuisine, rating, delivery_time, min_order, image, address, is_open) VALUES
(1,'Luigi''s Italian Kitchen', 'Italian', 4.5, '25-35 min', 15.00, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', '123 Main St, Downtown', TRUE),
(2, 'Sakura Sushi', 'Japanese', 4.9, '25-35 min', 25.00, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop', '456 Cherry Blossom Ave, Kyoto', TRUE),
(3, 'Grill & Co.', 'American', 4.6, '20-30 min', 15.00, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&h=600&fit=crop', '789 Freedom St, New York', TRUE),
(4, 'Green Bites', 'Healthy', 4.7, '15-25 min', 12.00, 'https://images.unsplash.com/photo-1498837167922-ddd27525bf8642?w=800&h=600&fit=crop', '321 Wellness Rd, California', TRUE),
(5, 'El Gato Loco', 'Mexican', 4.5, '20-30 min', 10.00, 'https://images.unsplash.com/photo-1552332386-f8dd00645070?w=800&h=600&fit=crop', '567 Sombrero Blvd, Mexico City', TRUE),
(6, 'Thai Orchid', 'Thai', 4.8, '25-35 min', 18.00, 'https://images.unsplash.com/photo-1626736198443-b4b9b47a4d69?w=800&h=600&fit=crop', '890 Elephant St, Bangkok', TRUE),
(7, 'Mumbai Palace', 'Indian', 4.9, '30-40 min', 22.00, 'https://unsplash.com/photos/a-large-building-with-a-red-dome-on-top-of-it-AZr0Zf4IPfs', 'x234 Taj Mahal Lane, Mumbai', TRUE),
(8, 'The Pitmaster', 'BBQ', 4.7, '35-45 min', 25.00, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&h=600&fit=crop', '456 Smokey Ave, Texas', TRUE),
(9, 'Saigon Pho', 'Vietnamese', 4.8, '25-35 min', 15.00, 'https://images.unsplash.com/photo-1585109649234-3968e7a4a5f2?w=800&h=600&fit=crop', '101 Pho St, Ho Chi Minh', TRUE),
(10, 'Olympus Grill', 'Greek', 4.6, '30-40 min', 18.00, 'https://images.unsplash.com/photo-1505253716362-af78986b5b97?w=800&h=600&fit=crop', '202 Parthenon Rd, Athens', TRUE),
(11, 'Seoul Food', 'Korean', 4.7, '25-35 min', 20.00, 'https://images.unsplash.com/photo-1567110453382-e0b5a734da52?w=800&h=600&fit=crop', '303 Kimchi Ave, Seoul', TRUE),
(12, 'Le Cordon Bleu', 'French', 4.9, '40-50 min', 30.00, 'https://images.unsplash.com/photo-1559348331-6f21729922d1?w=800&h=600&fit=crop', '404 Eiffel Tower Rd, Paris', TRUE);

INSERT INTO menu_items (name, description, price, image, category, restaurant_id, is_veg, rating) VALUES
-- Nonna\'s Kitchen (Restaurant 1)
('Gnocchi di Patate', 'Soft potato dumplings with a rich tomato and basil sauce', 18.99, 'https://images.unsplash.com/photo-1621996346565-e326b20f5413?w=500&h=400&fit=crop', 'Pasta', 1, TRUE, 4.9),
('Risotto ai Funghi', 'Creamy risotto with wild mushrooms and parmesan cheese', 22.99, 'https://images.unsplash.com/photo-1595908129363-1cf6938642d2?w=500&h=400&fit=crop', 'Risotto', 1, TRUE, 4.8),
('Bistecca alla Fiorentina', 'Grilled T-bone steak, seasoned with rosemary and olive oil', 35.99, 'https://images.unsplash.com/photo-1551028150-64b9f398f67b?w=500&h=400&fit=crop', 'Main Course', 1, FALSE, 5.0),
('Panna Cotta', 'Silky smooth cooked cream dessert with a berry coulis', 9.99, 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500&h=400&fit=crop', 'Desserts', 1, TRUE, 4.9),
('Caprese Salad', 'Fresh mozzarella, tomatoes, basil, and balsamic glaze', 12.99, 'https://images.unsplash.com/photo-1576992793299-a1b4b3801325?w=500&h=400&fit=crop', 'Appetizers', 1, TRUE, 4.7),
('Osso Buco', 'Braised veal shanks in a hearty vegetable and white wine sauce', 28.99, 'https://images.unsplash.com/photo-1604329423348-90099a7f903c?w=500&h=400&fit=crop', 'Main Course', 1, FALSE, 4.9),
('Cannoli', 'Crispy pastry shells filled with sweet ricotta cream', 8.99, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop', 'Desserts', 1, TRUE, 4.8),

-- Sakura Sushi (Restaurant 2)
('Tuna Tataki', 'Seared tuna with ponzu sauce and scallions', 16.99, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=400&fit=crop', 'Appetizers', 2, FALSE, 4.9),
('Unagi Don', 'Grilled eel over a bed of seasoned rice', 24.99, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&h=400&fit=crop', 'Donburi', 2, FALSE, 4.8),
('Miso Soup', 'Traditional Japanese soup with tofu, seaweed, and scallions', 4.99, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop', 'Soups', 2, TRUE, 4.7),
('Edamame', 'Steamed and salted young soybeans', 5.99, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=400&fit=crop', 'Appetizers', 2, TRUE, 4.6),
('Rainbow Roll', 'Crab, cucumber, and avocado topped with a variety of fresh fish', 18.99, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&h=400&fit=crop', 'Sushi', 2, FALSE, 4.9),
('Wagyu Nigiri', 'Premium A5 Wagyu beef lightly seared, served over rice', 29.99, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&h=400&fit=crop', 'Nigiri', 2, FALSE, 5.0),
('Matcha Ice Cream', 'Rich and creamy green tea ice cream', 7.99, 'https://images.unsplash.com/photo-1501432678382-f2a1b3b5069a?w=500&h=400&fit=crop', 'Desserts', 2, TRUE, 4.8),

-- Grill & Co. (Restaurant 3)
('Philly Cheesesteak', 'Thinly sliced beef with melted cheese and onions on a hoagie roll', 14.99, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&h=400&fit=crop', 'Sandwiches', 3, FALSE, 4.7),
('New York Strip Steak', 'A juicy 12oz steak served with mashed potatoes and asparagus', 32.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop', 'Main Course', 3, FALSE, 4.9),
('Clam Chowder', 'Creamy New England style clam chowder in a sourdough bread bowl', 11.99, 'https://images.unsplash.com/photo-1541592106381-b5883c288533?w=500&h=400&fit=crop', 'Soups', 3, FALSE, 4.8),
('Cobb Salad', 'Mixed greens with chicken, bacon, avocado, egg, and blue cheese', 16.99, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&h=400&fit=crop', 'Salads', 3, FALSE, 4.7),
('Apple Pie', 'Classic American apple pie with a scoop of vanilla ice cream', 8.99, 'https://images.unsplash.com/photo-1535146034234-03518883512d?w=500&h=400&fit=crop', 'Desserts', 3, TRUE, 4.8),
('Buffalo Wings', 'Spicy chicken wings served with celery and blue cheese dressing', 13.99, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&h=400&fit=crop', 'Appetizers', 3, FALSE, 4.6),
('Reuben Sandwich', 'Corned beef, Swiss cheese, sauerkraut, and Russian dressing on rye', 15.99, 'https://images.unsplash.com/photo-1625194659632-545c55b5b8f4?w=500&h=400&fit=crop', 'Sandwiches', 3, FALSE, 4.8),

-- Green Bites (Restaurant 4)
('Quinoa Salad', 'Quinoa with roasted vegetables, feta, and a lemon vinaigrette', 13.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop', 'Salads', 4, TRUE, 4.8),
('Avocado Toast', 'Smashed avocado on whole-grain toast with chili flakes and sea salt', 11.99, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&h=400&fit=crop', 'Breakfast', 4, TRUE, 4.7),
('Lentil Soup', 'Hearty and nutritious lentil soup with vegetables and herbs', 9.99, 'https://images.unsplash.com/photo-1604329423348-90099a7f903c?w=500&h=400&fit=crop', 'Soups', 4, TRUE, 4.6),
('Grilled Salmon', 'Salmon fillet with a side of steamed asparagus and brown rice', 21.99, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=400&fit=crop', 'Main Course', 4, FALSE, 4.9),
('Berry Smoothie', 'A blend of mixed berries, yogurt, and a touch of honey', 8.99, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&h=400&fit=crop', 'Drinks', 4, TRUE, 4.7),
('Hummus Platter', 'Creamy hummus with pita bread, olives, and fresh vegetables', 12.99, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&h=400&fit=crop', 'Appetizers', 4, TRUE, 4.8),
('Chia Seed Pudding', 'Chia seeds soaked in almond milk, topped with fresh fruit', 7.99, 'https://images.unsplash.com/photo-1504191964892-59a0422c5def?w=500&h=400&fit=crop', 'Desserts', 4, TRUE, 4.6),

-- El Gato Loco (Restaurant 5)
('Al Pastor Tacos', 'Marinated pork tacos with pineapple, cilantro, and onions', 13.99, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=400&fit=crop', 'Tacos', 5, FALSE, 4.8),
('Guacamole', 'Freshly made guacamole with tortilla chips', 9.99, 'https://images.unsplash.com/photo-1570169988405-b71ce0fb83a1?w=500&h=400&fit=crop', 'Appetizers', 5, TRUE, 4.9),
('Mole Poblano', 'Chicken in a rich, complex sauce of chilies, chocolate, and spices', 19.99, 'https://images.unsplash.com/photo-1598515213692-5f2818362236?w=500&h=400&fit=crop', 'Main Course', 5, FALSE, 4.9),
('Ceviche', 'Fresh fish cured in citrus juices with onions, tomatoes, and cilantro', 16.99, 'https://images.unsplash.com/photo-1625944022323-c41aff7c6946?w=500&h=400&fit=crop', 'Appetizers', 5, FALSE, 4.8),
('Horchata', 'Sweet and creamy rice milk drink with cinnamon', 5.99, 'https://images.unsplash.com/photo-1551835497-63e35a4345e0?w=500&h=400&fit=crop', 'Drinks', 5, TRUE, 4.7),
('Tamales', 'Steamed masa filled with chicken, pork, or cheese', 12.99, 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=500&h=400&fit=crop', 'Main Course', 5, FALSE, 4.8),
('Flan', 'Creamy caramel custard dessert', 7.99, 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=400&fit=crop', 'Desserts', 5, TRUE, 4.9),

-- Thai Orchid (Restaurant 6)
('Panang Curry', 'A rich and creamy curry with beef, coconut milk, and peanuts', 17.99, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop', 'Curries', 6, FALSE, 4.9),
('Som Tum', 'Spicy green papaya salad with peanuts, tomatoes, and long beans', 12.99, 'https://images.unsplash.com/photo-1563379926-88f675e62592?w=500&h=400&fit=crop', 'Salads', 6, TRUE, 4.8),
('Larb Gai', 'Spicy minced chicken salad with lime, chili, and fresh herbs', 14.99, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500&h=400&fit=crop', 'Salads', 6, FALSE, 4.7),
('Khao Soi', 'Northern Thai coconut curry noodle soup with chicken', 16.99, 'https://images.unsplash.com/photo-1626736198443-b4b9b47a4d69?w=500&h=400&fit=crop', 'Soups', 6, FALSE, 4.9),
('Satay', 'Grilled chicken skewers with a peanut dipping sauce', 11.99, 'https://images.unsplash.com/photo-1606557187441-48b929a2a0b2?w=500&h=400&fit=crop', 'Appetizers', 6, FALSE, 4.8),
('Thai Iced Tea', 'Sweet and creamy black tea with condensed milk', 5.99, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop', 'Drinks', 6, TRUE, 4.9),
('Red Curry', 'Spicy red curry with duck, pineapple, and cherry tomatoes', 22.99, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&h=400&fit=crop', 'Curries', 6, FALSE, 4.9),

-- Mumbai Palace (Restaurant 7)
('Rogan Josh', 'Aromatic lamb curry with a blend of spices and yogurt', 19.99, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop', 'Curries', 7, FALSE, 4.9),
('Vindaloo', 'A spicy and tangy pork curry from Goa', 18.99, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=400&fit=crop', 'Curries', 7, FALSE, 4.8),
('Chole Bhature', 'Spicy chickpea curry with fluffy fried bread', 15.99, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop', 'Main Course', 7, TRUE, 4.8),
('Dosa', 'A crispy crepe made from fermented rice and lentils, served with sambar and chutney', 14.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop', 'Main Course', 7, TRUE, 4.9),
('Kulfi', 'Traditional Indian ice cream, dense and creamy', 7.99, 'https://images.unsplash.com/photo-1589301773859-34462d1743e8?w=500&h=400&fit=crop', 'Desserts', 7, TRUE, 4.8),
('Pakora', 'Assorted vegetables dipped in gram flour batter and deep-fried', 9.99, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop', 'Appetizers', 7, TRUE, 4.7),
('Jalebi', 'Sweet and crispy spirals soaked in saffron syrup', 6.99, 'https://images.unsplash.com/photo-1625944022323-c41aff7c6946?w=500&h=400&fit=crop', 'Desserts', 7, TRUE, 4.8),

-- The Pitmaster (Restaurant 8)
('St. Louis Style Ribs', 'Dry-rubbed and slow-smoked ribs with a tangy BBQ sauce', 24.99, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&h=400&fit=crop', 'BBQ', 8, FALSE, 4.9),
('Smoked Sausage', 'Spicy smoked sausage served with pickles, onions, and mustard', 14.99, 'https://images.unsplash.com/photo-1558030006-45067539952?w=500&h=400&fit=crop', 'BBQ', 8, FALSE, 4.7),
('Burnt Ends', 'Crispy and flavorful chunks of smoked brisket', 19.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop', 'BBQ', 8, FALSE, 5.0),
('Collard Greens', 'Slow-cooked collard greens with bacon and spices', 7.99, 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=500&h=400&fit=crop', 'Sides', 8, FALSE, 4.6),
('Banana Pudding', 'Creamy banana pudding with vanilla wafers and whipped cream', 8.99, 'https://images.unsplash.com/photo-1507066274042-8a683a1e6ffe?w=500&h=400&fit=crop', 'Desserts', 8, TRUE, 4.8),
('Fried Okra', 'Crispy fried okra with a side of ranch dressing', 6.99, 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=500&h=400&fit=crop', 'Sides', 8, TRUE, 4.5),
('Sweet Tea', 'Classic Southern sweet tea', 3.99, 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500&h=400&fit=crop', 'Drinks', 8, TRUE, 4.9),

-- Saigon Pho (Restaurant 9)
('Pho Bo', 'Classic Vietnamese beef noodle soup', 14.99, 'https://images.unsplash.com/photo-1585109649234-3968e7a4a5f2?w=500&h=400&fit=crop', 'Pho', 9, FALSE, 4.9),
('Banh Mi', 'Vietnamese sandwich with grilled pork, pickled vegetables, and cilantro', 10.99, 'https://images.unsplash.com/photo-1541592106381-b5883c288533?w=500&h=400&fit=crop', 'Sandwiches', 9, FALSE, 4.8),
('Goi Cuon', 'Fresh spring rolls with shrimp, herbs, and peanut sauce', 8.99, 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=500&h=400&fit=crop', 'Appetizers', 9, FALSE, 4.7),
('Bun Cha', 'Grilled pork and noodles with a side of fresh herbs and dipping sauce', 16.99, 'https://images.unsplash.com/photo-1563379926-88f675e62592?w=500&h=400&fit=crop', 'Noodles', 9, FALSE, 4.9),
('Ca Phe Sua Da', 'Vietnamese iced coffee with sweetened condensed milk', 5.99, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop', 'Drinks', 9, TRUE, 4.9),

-- Olympus Grill (Restaurant 10)
('Gyro Platter', 'Sliced lamb and beef with pita, tzatziki, and Greek salad', 17.99, 'https://images.unsplash.com/photo-1505253716362-af78986b5b97?w=500&h=400&fit=crop', 'Platters', 10, FALSE, 4.8),
('Spanakopita', 'Spinach and feta cheese pie in flaky phyllo dough', 9.99, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=400&fit=crop', 'Appetizers', 10, TRUE, 4.7),
('Moussaka', 'Layered eggplant and minced meat casserole with béchamel sauce', 19.99, 'https://images.unsplash.com/photo-1590004953392-5aba7ae2978e?w=500&h=400&fit=crop', 'Main Course', 10, FALSE, 4.9),
('Souvlaki', 'Grilled skewers of pork or chicken with lemon and oregano', 15.99, 'https://images.unsplash.com/photo-1626736198443-b4b9b47a4d69?w=500&h=400&fit=crop', 'Main Course', 10, FALSE, 4.8),
('Baklava', 'Sweet pastry with layers of phyllo, nuts, and honey', 7.99, 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=500&h=400&fit=crop', 'Desserts', 10, TRUE, 4.9),

-- Seoul Food (Restaurant 11)
('Kimchi Jjigae', 'Spicy kimchi stew with tofu and pork', 16.99, 'https://images.unsplash.com/photo-1584279350112-b7de34166893?w=500&h=400&fit=crop', 'Stews', 11, FALSE, 4.8),
('Bibimbap', 'Mixed rice with vegetables, beef, and a fried egg', 18.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop', 'Rice Dishes', 11, FALSE, 4.9),
('Bulgogi', 'Marinated and grilled beef', 22.99, 'https://images.unsplash.com/photo-1604329423348-90099a7f903c?w=500&h=400&fit=crop', 'Main Course', 11, FALSE, 5.0),
('Haemul Pajeon', 'Seafood and scallion pancake', 14.99, 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500&h=400&fit=crop', 'Appetizers', 11, FALSE, 4.7),
('Tteokbokki', 'Spicy stir-fried rice cakes', 12.99, 'https://images.unsplash.com/photo-1621996346565-e326b20f5413?w=500&h=400&fit=crop', 'Appetizers', 11, TRUE, 4.6),

-- Le Cordon Bleu (Restaurant 12)
('Coq au Vin', 'Chicken braised with wine, mushrooms, and garlic', 28.99, 'https://images.unsplash.com/photo-1598515213692-5f2818362236?w=500&h=400&fit=crop', 'Main Course', 12, FALSE, 4.9),
('Bouillabaisse', 'Traditional Provençal fish stew', 32.99, 'https://images.unsplash.com/photo-1598515213692-5f2818362236?w=500&h=400&fit=crop', 'Soups', 12, FALSE, 4.8),
('Escargots de Bourgogne', 'Snails baked in garlic-parsley butter', 16.99, 'https://images.unsplash.com/photo-1598515213692-5f2818362236?w=500&h=400&fit=crop', 'Appetizers', 12, FALSE, 4.7),
('Crème Brûlée', 'Rich custard base with a caramelized sugar topping', 10.99, 'https://images.unsplash.com/photo-1598515213692-5f2818362236?w=500&h=400&fit=crop', 'Desserts', 12, TRUE, 5.0),
('Salade Niçoise', 'Salad with tuna, green beans, hard-boiled eggs, and olives', 18.99, 'https://images.unsplash.com/photo-1598515213692-5f2818362236?w=500&h=400&fit=crop', 'Salads', 12, FALSE, 4.6);


CREATE INDEX idx_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_user_id ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_date ON orders(order_date);