import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Clock, ShieldCheck, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import heroImage from '@/assets/hero-food.jpg';
import pizzaImage from '@/assets/pizza.jpg';
import burgerImage from '@/assets/burger.jpg';
import sushiImage from '@/assets/sushi.jpg';
import saladImage from '@/assets/salad.jpg';

const Index = () => {
  const { addToCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      setIsLoggedIn(!!(token && userData));
    };

    // Check on mount
    checkLoginStatus();

    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener('storage', checkLoginStatus);

    // Listen for focus events (when user returns to the tab)
    window.addEventListener('focus', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('focus', checkLoginStatus);
    };
  }, []);
  
  const featuredDishes = [
    { 
      id: '1',
      name: 'Margherita Pizza', 
      price: 12.99, 
      image: pizzaImage, 
      restaurant: "Luigi's Italian",
      description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
      category: 'Pizza',
      restaurantId: '1',
      isVeg: true,
      rating: 4.5,
    },
    { 
      id: '2',
      name: 'Classic Burger', 
      price: 10.99, 
      image: burgerImage, 
      restaurant: 'The Burger Joint',
      description: 'Beef patty with lettuce, tomato, and special sauce',
      category: 'Burgers',
      restaurantId: '3',
      isVeg: false,
      rating: 4.4,
    },
    { 
      id: '3',
      name: 'Sushi Platter', 
      price: 24.99, 
      image: sushiImage, 
      restaurant: 'Tokyo Sushi Bar',
      description: 'Fresh assortment of premium sushi rolls',
      category: 'Sushi',
      restaurantId: '2',
      isVeg: false,
      rating: 4.7,
    },
    { 
      id: '4',
      name: 'Caesar Salad', 
      price: 8.99, 
      image: saladImage, 
      restaurant: 'Fresh Greens Co.',
      description: 'Fresh romaine with parmesan and caesar dressing',
      category: 'Salads',
      restaurantId: '4',
      isVeg: true,
      rating: 4.5,
    },
  ];

  const handleAddToCart = (dish: any) => {
    addToCart(dish);
    toast.success(`${dish.name} added to cart!`);
  };

  const features = [
    { icon: Search, title: 'Easy Browse', description: 'Find your favorite restaurants and dishes quickly' },
    { icon: Clock, title: 'Fast Delivery', description: 'Get your food delivered in 30 minutes or less' },
    { icon: ShieldCheck, title: 'Safe & Secure', description: 'Secure payments and verified restaurants' },
    { icon: Zap, title: 'Real-time Tracking', description: 'Track your order from kitchen to doorstep' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/50" />
        </div>
        
        <div className="relative z-10 container max-w-4xl text-center space-y-6 px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in">
            Delicious Food,
            <span className="text-gradient block mt-2">Delivered Fast</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Order from your favorite restaurants and get fresh, hot meals delivered to your doorstep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/restaurants">
              <Button size="lg" className="text-lg px-8 h-14 shadow-lg hover:shadow-xl transition-shadow">
                Order Now
              </Button>
            </Link>
            {!isLoggedIn && (
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                  Sign Up
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Dishes</h2>
            <p className="text-xl text-muted-foreground">Popular meals our customers love</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDishes.map((dish, index) => (
              <Card
                key={dish.name}
                className="overflow-hidden card-hover card-shimmer shadow-food-card stagger-item group"
                style={{ transform: 'translateY(20px)' }}
              >
                <div className="aspect-square overflow-hidden image-zoom-hover relative">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{dish.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{dish.restaurant}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">${dish.price}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(dish)}
                      className="button-glow-pulse"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/restaurants">
              <Button size="lg" variant="outline">
                View All Restaurants
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose FoodHub?</h2>
            <p className="text-xl text-muted-foreground">We make food ordering easy and convenient</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="text-center p-6 border-2 card-hover group hover:border-primary transition-all stagger-item"
                style={{ transform: 'translateY(20px)' }}
              >
                <CardContent className="pt-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 animate-float">
                    <feature.icon className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers enjoying delicious meals delivered right to their door
          </p>
          <Link to="/restaurants">
            <Button size="lg" variant="secondary" className="text-lg px-12 h-14">
              Start Ordering
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">FoodHub</h3>
              <p className="text-sm text-muted-foreground">
                Delivering happiness, one meal at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/restaurants" className="hover:text-primary transition-colors">Restaurants</Link></li>
                <li><Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
                <li><Link to="/profile" className="hover:text-primary transition-colors">Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 FoodHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
