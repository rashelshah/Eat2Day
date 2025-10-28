package com.tastetrack.controller;

import com.tastetrack.entity.User;
import com.tastetrack.entity.Restaurant;
import com.tastetrack.entity.MenuItem;
import com.tastetrack.repository.UserRepository;
import com.tastetrack.repository.RestaurantRepository;
import com.tastetrack.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin-setup")
@CrossOrigin(origins = "*")
public class AdminSetupController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private EntityManager entityManager;
    
    @GetMapping("/create-admin")
    public ResponseEntity<Map<String, String>> createAdmin() {
        Map<String, String> response = new HashMap<>();
        
        try {
            // Check if admin already exists
            Optional<User> existingAdmin = userRepository.findByEmail("admin@eat2day.com");
            
            User admin;
            if (existingAdmin.isPresent()) {
                admin = existingAdmin.get();
                response.put("message", "Admin user already exists, updating password");
            } else {
                admin = new User();
                admin.setEmail("admin@eat2day.com");
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setPhone("+1 (555) 000-0000");
                admin.setRole(User.Role.ADMIN);
                admin.setEnabled(true);
                response.put("message", "Admin user created successfully");
            }
            
            // Set/update password
            String plainPassword = "password";
            String hashedPassword = passwordEncoder.encode(plainPassword);
            admin.setPassword(hashedPassword);
            
            userRepository.save(admin);
            
            response.put("email", "admin@eat2day.com");
            response.put("password", plainPassword);
            response.put("passwordHash", hashedPassword);
            response.put("role", admin.getRole().name());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/test-password")
    public ResponseEntity<Map<String, Object>> testPassword(
            @RequestParam String email,
            @RequestParam String password) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                response.put("found", false);
                response.put("message", "User not found");
                return ResponseEntity.ok(response);
            }
            
            User user = userOpt.get();
            response.put("found", true);
            response.put("email", user.getEmail());
            response.put("role", user.getRole().name());
            response.put("enabled", user.isEnabled());
            response.put("storedPasswordHash", user.getPassword());
            
            boolean matches = passwordEncoder.matches(password, user.getPassword());
            response.put("passwordMatches", matches);
            
            // Also test encoding the provided password
            String newHash = passwordEncoder.encode(password);
            response.put("newHashForSamePassword", newHash);
            response.put("newHashMatches", passwordEncoder.matches(password, newHash));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/refresh-menu-data")
    @Transactional
    public ResponseEntity<Map<String, Object>> refreshMenuData() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Delete all existing menu items and restaurants
            menuItemRepository.deleteAll();
            restaurantRepository.deleteAll();

            // Reset auto-increment counters
            entityManager.createNativeQuery("ALTER TABLE restaurants AUTO_INCREMENT = 1").executeUpdate();
            entityManager.createNativeQuery("ALTER TABLE menu_items AUTO_INCREMENT = 1").executeUpdate();
            entityManager.flush();

            // Create restaurants with new images
            List<Restaurant> restaurants = new ArrayList<>();

            Restaurant italian = new Restaurant();
            italian.setName("Nonna's Kitchen");
            italian.setCuisine("Italian");
            italian.setRating(4.8);
            italian.setDeliveryTime("30-40 min");
            italian.setMinOrder(20.00);
            italian.setImage("https://images.unsplash.com/photo-1590004953392-5aba7ae2978e?w=800&h=600&fit=crop");
            italian.setAddress("123 Pasta Lane, Rome");
            italian.setIsOpen(true);
            restaurants.add(italian);

            Restaurant japanese = new Restaurant();
            japanese.setName("Sakura Sushi");
            japanese.setCuisine("Japanese");
            japanese.setRating(4.9);
            japanese.setDeliveryTime("25-35 min");
            japanese.setMinOrder(25.00);
            japanese.setImage("https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop");
            japanese.setAddress("456 Cherry Blossom Ave, Kyoto");
            japanese.setIsOpen(true);
            restaurants.add(japanese);

            Restaurant american = new Restaurant();
            american.setName("Grill & Co.");
            american.setCuisine("American");
            american.setRating(4.6);
            american.setDeliveryTime("20-30 min");
            american.setMinOrder(15.00);
            american.setImage("https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&h=600&fit=crop");
            american.setAddress("789 Freedom St, New York");
            american.setIsOpen(true);
            restaurants.add(american);

            Restaurant healthy = new Restaurant();
            healthy.setName("Green Bites");
            healthy.setCuisine("Healthy");
            healthy.setRating(4.7);
            healthy.setDeliveryTime("15-25 min");
            healthy.setMinOrder(12.00);
            healthy.setImage("https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop");
            healthy.setAddress("321 Wellness Rd, California");
            healthy.setIsOpen(true);
            restaurants.add(healthy);

            Restaurant mexican = new Restaurant();
            mexican.setName("El Gato Loco");
            mexican.setCuisine("Mexican");
            mexican.setRating(4.5);
            mexican.setDeliveryTime("20-30 min");
            mexican.setMinOrder(10.00);
            mexican.setImage("https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&h=600&fit=crop");
            mexican.setAddress("567 Sombrero Blvd, Mexico City");
            mexican.setIsOpen(true);
            restaurants.add(mexican);

            Restaurant thai = new Restaurant();
            thai.setName("Thai Orchid");
            thai.setCuisine("Thai");
            thai.setRating(4.8);
            thai.setDeliveryTime("25-35 min");
            thai.setMinOrder(18.00);
            thai.setImage("https://images.unsplash.com/photo-1626736198443-b4b9b47a4d69?w=800&h=600&fit=crop");
            thai.setAddress("890 Elephant St, Bangkok");
            thai.setIsOpen(true);
            restaurants.add(thai);

            Restaurant indian = new Restaurant();
            indian.setName("Mumbai Palace");
            indian.setCuisine("Indian");
            indian.setRating(4.9);
            indian.setDeliveryTime("30-40 min");
            indian.setMinOrder(22.00);
            indian.setImage("https://images.unsplash.com/photo-1589301773859-34462d1743e8?w=800&h=600&fit=crop");
            indian.setAddress("234 Taj Mahal Lane, Mumbai");
            indian.setIsOpen(true);
            restaurants.add(indian);

            Restaurant bbq = new Restaurant();
            bbq.setName("The Pitmaster");
            bbq.setCuisine("BBQ");
            bbq.setRating(4.7);
            bbq.setDeliveryTime("35-45 min");
            bbq.setMinOrder(25.00);
            bbq.setImage("https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&h=600&fit=crop");
            bbq.setAddress("456 Smokey Ave, Texas");
            bbq.setIsOpen(true);
            restaurants.add(bbq);

            Restaurant vietnamese = new Restaurant();
            vietnamese.setName("Saigon Pho");
            vietnamese.setCuisine("Vietnamese");
            vietnamese.setRating(4.8);
            vietnamese.setDeliveryTime("25-35 min");
            vietnamese.setMinOrder(15.00);
            vietnamese.setImage("https://images.unsplash.com/photo-1585109649234-3968e7a4a5f2?w=800&h=600&fit=crop");
            vietnamese.setAddress("101 Pho St, Ho Chi Minh");
            vietnamese.setIsOpen(true);
            restaurants.add(vietnamese);

            Restaurant greek = new Restaurant();
            greek.setName("Olympus Grill");
            greek.setCuisine("Greek");
            greek.setRating(4.6);
            greek.setDeliveryTime("30-40 min");
            greek.setMinOrder(18.00);
            greek.setImage("https://images.unsplash.com/photo-1505253716362-af78986b5b97?w=800&h=600&fit=crop");
            greek.setAddress("202 Parthenon Rd, Athens");
            greek.setIsOpen(true);
            restaurants.add(greek);

            Restaurant korean = new Restaurant();
            korean.setName("Seoul Food");
            korean.setCuisine("Korean");
            korean.setRating(4.7);
            korean.setDeliveryTime("25-35 min");
            korean.setMinOrder(20.00);
            korean.setImage("https://images.unsplash.com/photo-1567110453382-e0b5a734da52?w=800&h=600&fit=crop");
            korean.setAddress("303 Kimchi Ave, Seoul");
            korean.setIsOpen(true);
            restaurants.add(korean);

            Restaurant french = new Restaurant();
            french.setName("Le Cordon Bleu");
            french.setCuisine("French");
            french.setRating(4.9);
            french.setDeliveryTime("40-50 min");
            french.setMinOrder(30.00);
            french.setImage("https://images.unsplash.com/photo-1559348331-6f21729922d1?w=800&h=600&fit=crop");
            french.setAddress("404 Eiffel Tower Rd, Paris");
            french.setIsOpen(true);
            restaurants.add(french);

            // Save restaurants
            restaurantRepository.saveAll(restaurants);

            // Create menu items
            List<MenuItem> menuItems = new ArrayList<>();

            // Nonna's Kitchen - 7 dishes
            menuItems.add(createMenuItem("Gnocchi di Patate", "Soft potato dumplings with a rich tomato and basil sauce", 18.99, "https://images.unsplash.com/photo-1621996346565-e326b20f5413?w=500&h=400&fit=crop", "Pasta", italian, true, 4.9));
            menuItems.add(createMenuItem("Risotto ai Funghi", "Creamy risotto with wild mushrooms and parmesan cheese", 22.99, "https://images.unsplash.com/photo-1595908129363-1cf6938642d2?w=500&h=400&fit=crop", "Risotto", italian, true, 4.8));
            menuItems.add(createMenuItem("Bistecca alla Fiorentina", "Grilled T-bone steak, seasoned with rosemary and olive oil", 35.99, "https://images.unsplash.com/photo-1551028150-64b9f398f67b?w=500&h=400&fit=crop", "Main Course", italian, false, 5.0));
            menuItems.add(createMenuItem("Panna Cotta", "Silky smooth cooked cream dessert with a berry coulis", 9.99, "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500&h=400&fit=crop", "Desserts", italian, true, 4.9));
            menuItems.add(createMenuItem("Caprese Salad", "Fresh mozzarella, tomatoes, basil, and balsamic glaze", 12.99, "https://images.unsplash.com/photo-1576992793299-a1b4b3801325?w=500&h=400&fit=crop", "Appetizers", italian, true, 4.7));
            menuItems.add(createMenuItem("Osso Buco", "Braised veal shanks in a hearty vegetable and white wine sauce", 28.99, "https://images.unsplash.com/photo-1604329423348-90099a7f903c?w=500&h=400&fit=crop", "Main Course", italian, false, 4.9));
            menuItems.add(createMenuItem("Cannoli", "Crispy pastry shells filled with sweet ricotta cream", 8.99, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop", "Desserts", italian, true, 4.8));

            // Sakura Sushi - 7 dishes
            menuItems.add(createMenuItem("Tuna Tataki", "Seared tuna with ponzu sauce and scallions", 16.99, "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=400&fit=crop", "Appetizers", japanese, false, 4.9));
            menuItems.add(createMenuItem("Unagi Don", "Grilled eel over a bed of seasoned rice", 24.99, "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&h=400&fit=crop", "Donburi", japanese, false, 4.8));
            menuItems.add(createMenuItem("Miso Soup", "Traditional Japanese soup with tofu, seaweed, and scallions", 4.99, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop", "Soups", japanese, true, 4.7));
            menuItems.add(createMenuItem("Edamame", "Steamed and salted young soybeans", 5.99, "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=400&fit=crop", "Appetizers", japanese, true, 4.6));
            menuItems.add(createMenuItem("Rainbow Roll", "Crab, cucumber, and avocado topped with a variety of fresh fish", 18.99, "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&h=400&fit=crop", "Sushi", japanese, false, 4.9));
            menuItems.add(createMenuItem("Wagyu Nigiri", "Premium A5 Wagyu beef lightly seared, served over rice", 29.99, "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&h=400&fit=crop", "Nigiri", japanese, false, 5.0));
            menuItems.add(createMenuItem("Matcha Ice Cream", "Rich and creamy green tea ice cream", 7.99, "https://images.unsplash.com/photo-1501432678382-f2a1b3b5069a?w=500&h=400&fit=crop", "Desserts", japanese, true, 4.8));

            // Grill & Co. - 7 dishes
            menuItems.add(createMenuItem("Philly Cheesesteak", "Thinly sliced beef with melted cheese and onions on a hoagie roll", 14.99, "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&h=400&fit=crop", "Sandwiches", american, false, 4.7));
            menuItems.add(createMenuItem("New York Strip Steak", "A juicy 12oz steak served with mashed potatoes and asparagus", 32.99, "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop", "Main Course", american, false, 4.9));
            menuItems.add(createMenuItem("Clam Chowder", "Creamy New England style clam chowder in a sourdough bread bowl", 11.99, "https://images.unsplash.com/photo-1541592106381-b5883c288533?w=500&h=400&fit=crop", "Soups", american, false, 4.8));
            menuItems.add(createMenuItem("Cobb Salad", "Mixed greens with chicken, bacon, avocado, egg, and blue cheese", 16.99, "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&h=400&fit=crop", "Salads", american, false, 4.7));
            menuItems.add(createMenuItem("Apple Pie", "Classic American apple pie with a scoop of vanilla ice cream", 8.99, "https://images.unsplash.com/photo-1535146034234-9372a864a284?w=500&h=400&fit=crop", "Desserts", american, true, 4.8));
            menuItems.add(createMenuItem("Buffalo Wings", "Spicy chicken wings served with celery and blue cheese dressing", 13.99, "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&h=400&fit=crop", "Appetizers", american, false, 4.6));
            menuItems.add(createMenuItem("Reuben Sandwich", "Corned beef, Swiss cheese, sauerkraut, and Russian dressing on rye", 15.99, "https://images.unsplash.com/photo-1625194659632-545c55b5b8f4?w=500&h=400&fit=crop", "Sandwiches", american, false, 4.8));

            // Green Bites - 7 dishes
            menuItems.add(createMenuItem("Quinoa Salad", "Quinoa with roasted vegetables, feta, and a lemon vinaigrette", 13.99, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop", "Salads", healthy, true, 4.8));
            menuItems.add(createMenuItem("Avocado Toast", "Smashed avocado on whole-grain toast with chili flakes and sea salt", 11.99, "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&h=400&fit=crop", "Breakfast", healthy, true, 4.7));
            menuItems.add(createMenuItem("Lentil Soup", "Hearty and nutritious lentil soup with vegetables and herbs", 9.99, "https://images.unsplash.com/photo-1604329423348-90099a7f903c?w=500&h=400&fit=crop", "Soups", healthy, true, 4.6));
            menuItems.add(createMenuItem("Grilled Salmon", "Salmon fillet with a side of steamed asparagus and brown rice", 21.99, "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=400&fit=crop", "Main Course", healthy, false, 4.9));
            menuItems.add(createMenuItem("Berry Smoothie", "A blend of mixed berries, yogurt, and a touch of honey", 8.99, "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&h=400&fit=crop", "Drinks", healthy, true, 4.7));
            menuItems.add(createMenuItem("Hummus Platter", "Creamy hummus with pita bread, olives, and fresh vegetables", 12.99, "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&h=400&fit=crop", "Appetizers", healthy, true, 4.8));
            menuItems.add(createMenuItem("Chia Seed Pudding", "Chia seeds soaked in almond milk, topped with fresh fruit", 7.99, "https://images.unsplash.com/photo-1504191964892-59a0422c5def?w=500&h=400&fit=crop", "Desserts", healthy, true, 4.6));

            // El Gato Loco - 7 dishes
            menuItems.add(createMenuItem("Al Pastor Tacos", "Marinated pork tacos with pineapple, cilantro, and onions", 13.99, "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=400&fit=crop", "Tacos", mexican, false, 4.8));
            menuItems.add(createMenuItem("Guacamole", "Freshly made guacamole with tortilla chips", 9.99, "https://images.unsplash.com/photo-1570169988405-b71ce0fb83a1?w=500&h=400&fit=crop", "Appetizers", mexican, true, 4.9));
            menuItems.add(createMenuItem("Mole Poblano", "Chicken in a rich, complex sauce of chilies, chocolate, and spices", 19.99, "https://images.unsplash.com/photo-1598515213692-5f2818362236?w=500&h=400&fit=crop", "Main Course", mexican, false, 4.9));
            menuItems.add(createMenuItem("Ceviche", "Fresh fish cured in citrus juices with onions, tomatoes, and cilantro", 16.99, "https://images.unsplash.com/photo-1625944022323-c41aff7c6946?w=500&h=400&fit=crop", "Appetizers", mexican, false, 4.8));
            menuItems.add(createMenuItem("Horchata", "Sweet and creamy rice milk drink with cinnamon", 5.99, "https://images.unsplash.com/photo-1551835497-63e35a4345e0?w=500&h=400&fit=crop", "Drinks", mexican, true, 4.7));
            menuItems.add(createMenuItem("Tamales", "Steamed masa filled with chicken, pork, or cheese", 12.99, "https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=500&h=400&fit=crop", "Main Course", mexican, false, 4.8));
            menuItems.add(createMenuItem("Flan", "Creamy caramel custard dessert", 7.99, "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=400&fit=crop", "Desserts", mexican, true, 4.9));

            // Thai Orchid - 7 dishes
            menuItems.add(createMenuItem("Panang Curry", "A rich and creamy curry with beef, coconut milk, and peanuts", 17.99, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop", "Curries", thai, false, 4.9));
            menuItems.add(createMenuItem("Som Tum", "Spicy green papaya salad with peanuts, tomatoes, and long beans", 12.99, "https://images.unsplash.com/photo-1563379926-88f675e62592?w=500&h=400&fit=crop", "Salads", thai, true, 4.8));
            menuItems.add(createMenuItem("Larb Gai", "Spicy minced chicken salad with lime, chili, and fresh herbs", 14.99, "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500&h=400&fit=crop", "Salads", thai, false, 4.7));
            menuItems.add(createMenuItem("Khao Soi", "Northern Thai coconut curry noodle soup with chicken", 16.99, "https://images.unsplash.com/photo-1626736198443-b4b9b47a4d69?w=500&h=400&fit=crop", "Soups", thai, false, 4.9));
            menuItems.add(createMenuItem("Satay", "Grilled chicken skewers with a peanut dipping sauce", 11.99, "https://images.unsplash.com/photo-1606557187441-48b929a2a0b2?w=500&h=400&fit=crop", "Appetizers", thai, false, 4.8));
            menuItems.add(createMenuItem("Thai Iced Tea", "Sweet and creamy black tea with condensed milk", 5.99, "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop", "Drinks", thai, true, 4.9));
            menuItems.add(createMenuItem("Red Curry", "Spicy red curry with duck, pineapple, and cherry tomatoes", 22.99, "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&h=400&fit=crop", "Curries", thai, false, 4.9));

            // Mumbai Palace - 7 dishes
            menuItems.add(createMenuItem("Rogan Josh", "Aromatic lamb curry with a blend of spices and yogurt", 19.99, "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop", "Curries", indian, false, 4.9));
            menuItems.add(createMenuItem("Vindaloo", "A spicy and tangy pork curry from Goa", 18.99, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=400&fit=crop", "Curries", indian, false, 4.8));
            menuItems.add(createMenuItem("Chole Bhature", "Spicy chickpea curry with fluffy fried bread", 15.99, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop", "Main Course", indian, true, 4.8));
            menuItems.add(createMenuItem("Dosa", "A crispy crepe made from fermented rice and lentils, served with sambar and chutney", 14.99, "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop", "Main Course", indian, true, 4.9));
            menuItems.add(createMenuItem("Kulfi", "Traditional Indian ice cream, dense and creamy", 7.99, "https://images.unsplash.com/photo-1589301773859-34462d1743e8?w=500&h=400&fit=crop", "Desserts", indian, true, 4.8));
            menuItems.add(createMenuItem("Pakora", "Assorted vegetables dipped in gram flour batter and deep-fried", 9.99, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop", "Appetizers", indian, true, 4.7));
            menuItems.add(createMenuItem("Jalebi", "Sweet and crispy spirals soaked in saffron syrup", 6.99, "https://images.unsplash.com/photo-1625944022323-c41aff7c6946?w=500&h=400&fit=crop", "Desserts", indian, true, 4.8));

            // The Pitmaster - 7 dishes
            menuItems.add(createMenuItem("St. Louis Style Ribs", "Dry-rubbed and slow-smoked ribs with a tangy BBQ sauce", 24.99, "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&h=400&fit=crop", "BBQ", bbq, false, 4.9));
            menuItems.add(createMenuItem("Smoked Sausage", "Spicy smoked sausage served with pickles, onions, and mustard", 14.99, "https://images.unsplash.com/photo-1558030006-450675393462?w=500&h=400&fit=crop", "BBQ", bbq, false, 4.7));
            menuItems.add(createMenuItem("Burnt Ends", "Crispy and flavorful chunks of smoked brisket", 19.99, "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop", "BBQ", bbq, false, 5.0));
            menuItems.add(createMenuItem("Collard Greens", "Slow-cooked collard greens with bacon and spices", 7.99, "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=500&h=400&fit=crop", "Sides", bbq, false, 4.6));
            menuItems.add(createMenuItem("Banana Pudding", "Creamy banana pudding with vanilla wafers and whipped cream", 8.99, "https://images.unsplash.com/photo-1507066274042-8a683a1e6ffe?w=500&h=400&fit=crop", "Desserts", bbq, true, 4.8));
            menuItems.add(createMenuItem("Fried Okra", "Crispy fried okra with a side of ranch dressing", 6.99, "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=500&h=400&fit=crop", "Sides", bbq, true, 4.5));
            menuItems.add(createMenuItem("Sweet Tea", "Classic Southern sweet tea", 3.99, "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500&h=400&fit=crop", "Drinks", bbq, true, 4.9));

            // Saigon Pho - 5 dishes
            menuItems.add(createMenuItem("Pho Bo", "Classic Vietnamese beef noodle soup", 14.99, "https://images.unsplash.com/photo-1585109649234-3968e7a4a5f2?w=500&h=400&fit=crop", "Pho", vietnamese, false, 4.9));
            menuItems.add(createMenuItem("Banh Mi", "Vietnamese sandwich with grilled pork, pickled vegetables, and cilantro", 10.99, "https://images.unsplash.com/photo-1541592106381-b5883c288533?w=500&h=400&fit=crop", "Sandwiches", vietnamese, false, 4.8));
            menuItems.add(createMenuItem("Goi Cuon", "Fresh spring rolls with shrimp, herbs, and peanut sauce", 8.99, "https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=500&h=400&fit=crop", "Appetizers", vietnamese, false, 4.7));
            menuItems.add(createMenuItem("Bun Cha", "Grilled pork and noodles with a side of fresh herbs and dipping sauce", 16.99, "https://images.unsplash.com/photo-1563379926-88f675e62592?w=500&h=400&fit=crop", "Noodles", vietnamese, false, 4.9));
            menuItems.add(createMenuItem("Ca Phe Sua Da", "Vietnamese iced coffee with sweetened condensed milk", 5.99, "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop", "Drinks", vietnamese, true, 4.9));

            // Olympus Grill - 5 dishes
            menuItems.add(createMenuItem("Gyro Platter", "Sliced lamb and beef with pita, tzatziki, and Greek salad", 17.99, "https://images.unsplash.com/photo-1505253716362-af78986b5b97?w=500&h=400&fit=crop", "Platters", greek, false, 4.8));
            menuItems.add(createMenuItem("Spanakopita", "Spinach and feta cheese pie in flaky phyllo dough", 9.99, "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=400&fit=crop", "Appetizers", greek, true, 4.7));
            menuItems.add(createMenuItem("Moussaka", "Layered eggplant and minced meat casserole with béchamel sauce", 19.99, "https://images.unsplash.com/photo-1590004953392-5aba7ae2978e?w=500&h=400&fit=crop", "Main Course", greek, false, 4.9));
            menuItems.add(createMenuItem("Souvlaki", "Grilled skewers of pork or chicken with lemon and oregano", 15.99, "https://images.unsplash.com/photo-1626736198443-b4b9b47a4d69?w=500&h=400&fit=crop", "Main Course", greek, false, 4.8));
            menuItems.add(createMenuItem("Baklava", "Sweet pastry with layers of phyllo, nuts, and honey", 7.99, "https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=500&h=400&fit=crop", "Desserts", greek, true, 4.9));

            // Seoul Food - 5 dishes
            menuItems.add(createMenuItem("Kimchi Jjigae", "Spicy kimchi stew with tofu and pork", 16.99, "https://images.unsplash.com/photo-1584279350112-b7de34166893?w=500&h=400&fit=crop", "Stews", korean, false, 4.8));
            menuItems.add(createMenuItem("Bibimbap", "Mixed rice with vegetables, beef, and a fried egg", 18.99, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop", "Rice Dishes", korean, false, 4.9));
            menuItems.add(createMenuItem("Bulgogi", "Marinated and grilled beef", 22.99, "https://images.unsplash.com/photo-1604329423348-90099a7f903c?w=500&h=400&fit=crop", "Main Course", korean, false, 5.0));
            menuItems.add(createMenuItem("Haemul Pajeon", "Seafood and scallion pancake", 14.99, "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500&h=400&fit=crop", "Appetizers", korean, false, 4.7));
            menuItems.add(createMenuItem("Tteokbokki", "Spicy stir-fried rice cakes", 12.99, "https://images.unsplash.com/photo-1621996346565-e326b20f5413?w=500&h=400&fit=crop", "Appetizers", korean, true, 4.6));

            // Le Cordon Bleu - 5 dishes
            menuItems.add(createMenuItem("Coq au Vin", "Chicken braised with wine, mushrooms, and garlic", 28.99, "https://images.unsplash.com/photo-1598515213692-5f2818362236?w=500&h=400&fit=crop", "Main Course", french, false, 4.9));
            menuItems.add(createMenuItem("Bouillabaisse", "Traditional Provençal fish stew", 32.99, "https://images.unsplash.com/photo-1598515213692-5f2818362236?w=500&h=400&fit=crop", "Soups", french, false, 4.8));
            menuItems.add(createMenuItem("Escargots de Bourgogne", "Snails baked in garlic-parsley butter", 16.99, "https://images.unsplash.com/photo-1598515213692-5f2818362236?w=500&h=400&fit=crop", "Appetizers", french, false, 4.7));
            menuItems.add(createMenuItem("Crème Brûlée", "Rich custard base with a caramelized sugar topping", 10.99, "https://images.unsplash.com/photo-1598515213692-5f2818362236?w=500&h=400&fit=crop", "Desserts", french, true, 5.0));
            menuItems.add(createMenuItem("Salade Niçoise", "Salad with tuna, green beans, hard-boiled eggs, and olives", 18.99, "https://images.unsplash.com/photo-1598515213692-5f2818362236?w=500&h=400&fit=crop", "Salads", french, false, 4.6));

            // Save all menu items
            menuItemRepository.saveAll(menuItems);

            response.put("success", true);
            response.put("message", "Menu data refreshed successfully");
            response.put("restaurantsCreated", restaurants.size());
            response.put("menuItemsCreated", menuItems.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    private MenuItem createMenuItem(String name, String description, double price, String image,
                                    String category, Restaurant restaurant, boolean isVeg, double rating) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setImage(image);
        item.setCategory(category);
        item.setRestaurant(restaurant);
        item.setIsVeg(isVeg);
        item.setRating(rating);
        return item;
    }
}