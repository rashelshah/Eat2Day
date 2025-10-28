import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { restaurantAPI } from '@/lib/api';
import RestaurantDialog from '@/components/admin/RestaurantDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminRestaurants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState<any>(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setIsLoading(true);
    try {
      const data = await restaurantAPI.getAll();
      setRestaurants(data);
    } catch (error: any) {
      toast.error('Failed to load restaurants');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedRestaurant(null);
    setDialogOpen(true);
  };

  const handleEdit = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setDialogOpen(true);
  };

  const handleDeleteClick = (restaurant: any) => {
    setRestaurantToDelete(restaurant);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!restaurantToDelete) return;

    try {
      await restaurantAPI.delete(restaurantToDelete.id);
      toast.success(`Restaurant "${restaurantToDelete.name}" deleted successfully`);
      loadRestaurants();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete restaurant');
    } finally {
      setDeleteDialogOpen(false);
      setRestaurantToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Restaurants</h1>
            <p className="text-muted-foreground">Add, edit, or remove restaurants</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Restaurant
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>

          {/* Restaurant List */}
          <div className="grid gap-4">
            {filteredRestaurants.map((restaurant) => (
              <Card key={restaurant.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={restaurant.image || '/placeholder.svg'} alt={restaurant.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-xl mb-1">{restaurant.name}</h3>
                          <p className="text-muted-foreground">{restaurant.cuisine}</p>
                        </div>
                        {restaurant.isOpen ? (
                          <Badge className="bg-secondary">Open</Badge>
                        ) : (
                          <Badge variant="outline">Closed</Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <span>⭐ {restaurant.rating}</span>
                        <span>🕒 {restaurant.deliveryTime}</span>
                        <span>💰 Min ${restaurant.minOrder}</span>
                        <span>📍 {restaurant.address}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(restaurant)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(restaurant)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
        )}

        {!isLoading && filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No restaurants found</p>
          </div>
        )}
      </div>

      <RestaurantDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        restaurant={selectedRestaurant}
        onSuccess={loadRestaurants}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{restaurantToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminRestaurants;
