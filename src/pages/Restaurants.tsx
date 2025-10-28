import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Clock, DollarSign, Loader2 } from 'lucide-react';
import { restaurantAPI } from '@/lib/api';
import { Restaurant } from '@/lib/mockData';

const Restaurants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch restaurants from backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await restaurantAPI.getAll();
        setRestaurants(data);
      } catch (err: any) {
        console.error('Error fetching restaurants:', err);
        setError(err.message || 'Failed to load restaurants');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Extract unique cuisines from the fetched restaurants
  const cuisines = ['All', ...Array.from(new Set(restaurants.map(r => r.cuisine)))];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = !selectedCuisine || selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Restaurants</h1>
          <p className="text-muted-foreground text-lg">Discover amazing restaurants near you</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg">Loading restaurants...</span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !error && (
          <>
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search restaurants or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {cuisines.map((cuisine) => (
                  <Button
                    key={cuisine}
                    variant={selectedCuisine === cuisine ? 'default' : 'outline'}
                    onClick={() => setSelectedCuisine(cuisine === 'All' ? null : cuisine)}
                    size="sm"
                  >
                    {cuisine}
                  </Button>
                ))}
              </div>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                  <Card className="overflow-hidden card-hover card-shimmer shadow-food-card h-full group animate-scale-in">
                    <div className="aspect-video bg-muted relative image-zoom-hover">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {restaurant.isOpen && (
                        <Badge className="absolute top-3 right-3 bg-secondary animate-pulse">Open</Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{restaurant.cuisine}</p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 group-hover:scale-110 transition-transform">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-medium">{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{restaurant.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>Min ${restaurant.minOrder}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredRestaurants.length === 0 && restaurants.length > 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No restaurants found matching your criteria</p>
              </div>
            )}

            {restaurants.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No restaurants available at the moment</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
