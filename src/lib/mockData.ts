export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantId: string;
  isVeg: boolean;
  rating: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  image: string;
  address: string;
  isOpen: boolean;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: { menuItem: MenuItem; quantity: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  orderDate: string;
  estimatedDelivery?: string;
}

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: "Luigi's Italian Kitchen",
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '25-35 min',
    minOrder: 15,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    address: '123 Main St, Downtown',
    isOpen: true,
  },
  {
    id: '2',
    name: 'Tokyo Sushi Bar',
    cuisine: 'Japanese',
    rating: 4.7,
    deliveryTime: '30-40 min',
    minOrder: 20,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
    address: '456 Oak Ave, Midtown',
    isOpen: true,
  },
  {
    id: '3',
    name: 'The Burger Joint',
    cuisine: 'American',
    rating: 4.3,
    deliveryTime: '20-30 min',
    minOrder: 10,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop',
    address: '789 Elm St, Uptown',
    isOpen: true,
  },
  {
    id: '4',
    name: 'Fresh Greens Co.',
    cuisine: 'Healthy',
    rating: 4.6,
    deliveryTime: '15-25 min',
    minOrder: 12,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    address: '321 Pine Rd, Downtown',
    isOpen: true,
  },
];

export const mockMenuItems: MenuItem[] = [
  // Luigi's Italian Kitchen (Restaurant 1) - Italian dishes
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop',
    category: 'Pizza',
    restaurantId: '1',
    isVeg: true,
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Traditional pepperoni with mozzarella cheese',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop',
    category: 'Pizza',
    restaurantId: '1',
    isVeg: false,
    rating: 4.6,
  },
  {
    id: '3',
    name: 'Quattro Formaggi Pizza',
    description: 'Four cheese pizza with mozzarella, gorgonzola, parmesan, and ricotta',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=400&fit=crop',
    category: 'Pizza',
    restaurantId: '1',
    isVeg: true,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with pancetta, eggs, and parmesan',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&h=400&fit=crop',
    category: 'Pasta',
    restaurantId: '1',
    isVeg: false,
    rating: 4.8,
  },
  {
    id: '5',
    name: 'Fettuccine Alfredo',
    description: 'Rich and creamy fettuccine with parmesan sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&h=400&fit=crop',
    category: 'Pasta',
    restaurantId: '1',
    isVeg: true,
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Lasagna Bolognese',
    description: 'Layered pasta with meat sauce, béchamel, and cheese',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&h=400&fit=crop',
    category: 'Pasta',
    restaurantId: '1',
    isVeg: false,
    rating: 4.9,
  },
  {
    id: '7',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop',
    category: 'Desserts',
    restaurantId: '1',
    isVeg: true,
    rating: 4.8,
  },

  // Tokyo Sushi Bar (Restaurant 2) - Japanese dishes
  {
    id: '8',
    name: 'California Roll',
    description: 'Fresh crab, avocado, and cucumber',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=400&fit=crop',
    category: 'Sushi',
    restaurantId: '2',
    isVeg: false,
    rating: 4.7,
  },
  {
    id: '9',
    name: 'Salmon Nigiri',
    description: 'Premium salmon over seasoned rice',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&h=400&fit=crop',
    category: 'Sushi',
    restaurantId: '2',
    isVeg: false,
    rating: 4.8,
  },
  {
    id: '10',
    name: 'Spicy Tuna Roll',
    description: 'Fresh tuna with spicy mayo and cucumber',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=500&h=400&fit=crop',
    category: 'Sushi',
    restaurantId: '2',
    isVeg: false,
    rating: 4.6,
  },
  {
    id: '11',
    name: 'Dragon Roll',
    description: 'Eel, cucumber, topped with avocado and eel sauce',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&h=400&fit=crop',
    category: 'Sushi',
    restaurantId: '2',
    isVeg: false,
    rating: 4.9,
  },
  {
    id: '12',
    name: 'Chicken Teriyaki',
    description: 'Grilled chicken with teriyaki sauce, served with rice',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1606557187441-48b929a2a0b2?w=500&h=400&fit=crop',
    category: 'Entrees',
    restaurantId: '2',
    isVeg: false,
    rating: 4.5,
  },
  {
    id: '13',
    name: 'Beef Ramen',
    description: 'Rich broth with tender beef, noodles, and soft-boiled egg',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop',
    category: 'Ramen',
    restaurantId: '2',
    isVeg: false,
    rating: 4.8,
  },
  {
    id: '14',
    name: 'Vegetable Tempura',
    description: 'Lightly battered and fried seasonal vegetables',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500&h=400&fit=crop',
    category: 'Appetizers',
    restaurantId: '2',
    isVeg: true,
    rating: 4.4,
  },

  // The Burger Joint (Restaurant 3) - American dishes
  {
    id: '15',
    name: 'Classic Burger',
    description: 'Beef patty with lettuce, tomato, and special sauce',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
    category: 'Burgers',
    restaurantId: '3',
    isVeg: false,
    rating: 4.4,
  },
  {
    id: '16',
    name: 'Bacon Cheeseburger',
    description: 'Double beef patty with crispy bacon and cheddar cheese',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&h=400&fit=crop',
    category: 'Burgers',
    restaurantId: '3',
    isVeg: false,
    rating: 4.7,
  },
  {
    id: '17',
    name: 'Veggie Burger',
    description: 'Plant-based patty with avocado and fresh veggies',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&h=400&fit=crop',
    category: 'Burgers',
    restaurantId: '3',
    isVeg: true,
    rating: 4.3,
  },
  {
    id: '18',
    name: 'BBQ Pulled Pork Burger',
    description: 'Slow-cooked pulled pork with BBQ sauce and coleslaw',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=400&fit=crop',
    category: 'Burgers',
    restaurantId: '3',
    isVeg: false,
    rating: 4.6,
  },
  {
    id: '19',
    name: 'Crispy Chicken Sandwich',
    description: 'Fried chicken breast with pickles and mayo',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=500&h=400&fit=crop',
    category: 'Sandwiches',
    restaurantId: '3',
    isVeg: false,
    rating: 4.5,
  },
  {
    id: '20',
    name: 'Loaded Fries',
    description: 'Crispy fries topped with cheese, bacon, and sour cream',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1630431341973-02e1d0f45a0f?w=500&h=400&fit=crop',
    category: 'Sides',
    restaurantId: '3',
    isVeg: false,
    rating: 4.6,
  },
  {
    id: '21',
    name: 'Onion Rings',
    description: 'Golden fried onion rings with ranch dipping sauce',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=400&fit=crop',
    category: 'Sides',
    restaurantId: '3',
    isVeg: true,
    rating: 4.4,
  },

  // Fresh Greens Co. (Restaurant 4) - Healthy dishes
  {
    id: '22',
    name: 'Caesar Salad',
    description: 'Fresh romaine with parmesan and caesar dressing',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=400&fit=crop',
    category: 'Salads',
    restaurantId: '4',
    isVeg: true,
    rating: 4.5,
  },
  {
    id: '23',
    name: 'Greek Salad',
    description: 'Tomatoes, cucumber, olives, feta cheese, and olive oil',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
    category: 'Salads',
    restaurantId: '4',
    isVeg: true,
    rating: 4.6,
  },
  {
    id: '24',
    name: 'Grilled Chicken Bowl',
    description: 'Quinoa, grilled chicken, avocado, and mixed greens',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
    category: 'Bowls',
    restaurantId: '4',
    isVeg: false,
    rating: 4.7,
  },
  {
    id: '25',
    name: 'Buddha Bowl',
    description: 'Roasted vegetables, chickpeas, quinoa, and tahini dressing',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
    category: 'Bowls',
    restaurantId: '4',
    isVeg: true,
    rating: 4.8,
  },
  {
    id: '26',
    name: 'Salmon Poke Bowl',
    description: 'Fresh salmon, edamame, seaweed, and sushi rice',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=500&h=400&fit=crop',
    category: 'Bowls',
    restaurantId: '4',
    isVeg: false,
    rating: 4.9,
  },
  {
    id: '27',
    name: 'Green Smoothie',
    description: 'Spinach, banana, mango, and almond milk',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&h=400&fit=crop',
    category: 'Smoothies',
    restaurantId: '4',
    isVeg: true,
    rating: 4.5,
  },
  {
    id: '28',
    name: 'Acai Bowl',
    description: 'Acai blend topped with granola, berries, and honey',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&h=400&fit=crop',
    category: 'Bowls',
    restaurantId: '4',
    isVeg: true,
    rating: 4.7,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    userId: 'user1',
    restaurantId: '1',
    items: [
      { menuItem: mockMenuItems[0], quantity: 2 },
      { menuItem: mockMenuItems[1], quantity: 1 },
    ],
    total: 40.97,
    status: 'delivered',
    deliveryAddress: '123 Home St, Apt 4B',
    orderDate: '2025-10-20T18:30:00',
    estimatedDelivery: '2025-10-20T19:15:00',
  },
  {
    id: 'ORD002',
    userId: 'user1',
    restaurantId: '2',
    items: [
      { menuItem: mockMenuItems[2], quantity: 3 },
      { menuItem: mockMenuItems[3], quantity: 2 },
    ],
    total: 53.95,
    status: 'out-for-delivery',
    deliveryAddress: '123 Home St, Apt 4B',
    orderDate: '2025-10-26T12:00:00',
    estimatedDelivery: '2025-10-26T12:45:00',
  },
];
