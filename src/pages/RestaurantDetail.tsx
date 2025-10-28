import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Clock, MapPin, Plus, Minus } from 'lucide-react';
import { restaurantAPI, menuItemAPI } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { addToCart, cartItems, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const restaurantData = await restaurantAPI.getById(id);
        setRestaurant(restaurantData);
        
        const menuItemsData = await menuItemAPI.getByRestaurant(id);
        setMenuItems(menuItemsData);
        
      } catch (err: any) {
        console.error('Error fetching restaurant data:', err);
        setError(err.message || 'Failed to load restaurant data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we fetch the restaurant details</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/restaurants">
            <Button>Back to Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Restaurant not found</h1>
          <Link to="/restaurants">
            <Button>Back to Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  const transformedMenuItems = menuItems.map(item => ({
    ...item,
    restaurantId: item.restaurant?.id?.toString() || item.restaurantId,
    id: item.id?.toString() || item.id
  }));

  const categories = ['All', ...new Set(transformedMenuItems.map((item) => item.category))];

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const getCartQuantity = (itemId: string) => {
    const cartItem = cartItems.find(ci => ci.item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const renderMenuItem = (item: any) => (
    <Card key={item.id} className="overflow-hidden card-hover card-shimmer shadow-food-card group animate-scale-in">
      <div className="aspect-video image-zoom-hover relative">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{item.name}</h3>
            {item.isVeg && <Badge variant="outline" className="mt-1 text-xs animate-bounce-in">Veg</Badge>}
          </div>
          <div className="flex items-center gap-1 group-hover:scale-110 transition-transform">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="text-sm font-medium">{item.rating}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">${item.price}</span>
          {getCartQuantity(item.id) > 0 ? (
            <div className="flex items-center gap-2 animate-bounce-in">
              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, getCartQuantity(item.id) - 1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{getCartQuantity(item.id)}</span>
              <Button size="sm" onClick={() => handleAddToCart(item)} className="button-glow-pulse">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => handleAddToCart(item)} className="button-glow-pulse">
              Add
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-muted/30 border-b">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                  <p className="text-muted-foreground">{restaurant.cuisine}</p>
                </div>
                {restaurant.isOpen && (
                  <Badge className="bg-secondary">Open Now</Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-medium">{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{restaurant.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(category === 'All' 
                  ? transformedMenuItems
                  : transformedMenuItems.filter((item) => item.category === category)
                ).map(renderMenuItem)}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 shadow-lg">
          <div className="container flex items-center justify-between">
            <div>
              <p className="font-semibold">{getTotalItems()} items added</p>
              <p className="text-sm opacity-90">Total: ${getTotalPrice().toFixed(2)}</p>
            </div>
            <Link to="/cart">
              <Button variant="secondary" size="lg">
                View Cart
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
