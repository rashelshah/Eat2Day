import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { menuItemAPI, restaurantAPI } from '@/lib/api';
import MenuItemDialog from '@/components/admin/MenuItemDialog';
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
import pizzaImage from '@/assets/pizza.jpg';
import burgerImage from '@/assets/burger.jpg';
import sushiImage from '@/assets/sushi.jpg';
import saladImage from '@/assets/salad.jpg';

const AdminMenu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurantFilter, setRestaurantFilter] = useState('all');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [restaurantsData] = await Promise.all([
        restaurantAPI.getAll()
      ]);
      setRestaurants(restaurantsData);

      // Load menu items for all restaurants
      const allMenuItems: any[] = [];
      for (const restaurant of restaurantsData) {
        try {
          const items = await menuItemAPI.getByRestaurant(restaurant.id.toString());
          allMenuItems.push(...items);
        } catch (error) {
          console.error(`Failed to load menu items for restaurant ${restaurant.id}`, error);
        }
      }
      setMenuItems(allMenuItems);
    } catch (error: any) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRestaurant = restaurantFilter === 'all' || item.restaurant?.id?.toString() === restaurantFilter;
    return matchesSearch && matchesRestaurant;
  });

  const getImage = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pizza': return pizzaImage;
      case 'burgers': return burgerImage;
      case 'sushi': return sushiImage;
      case 'salads':
      case 'bowls': return saladImage;
      default: return pizzaImage;
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await menuItemAPI.delete(itemToDelete.id);
      toast.success(`Item "${itemToDelete.name}" deleted successfully`);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete menu item');
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Menu Items</h1>
            <p className="text-muted-foreground">Add, edit, or remove menu items</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={restaurantFilter} onValueChange={setRestaurantFilter}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by restaurant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Restaurants</SelectItem>
              {restaurants.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image || getImage(item.category)}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">{item.category}</Badge>
                          {item.isVeg && <Badge variant="outline" className="bg-secondary/10">Veg</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.restaurant?.name}</p>
                      </div>
                      <p className="text-lg font-bold text-primary">${item.price}</p>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-muted-foreground">Rating:</span>
                      <span className="text-sm font-medium">⭐ {item.rating}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No menu items found</p>
              </div>
            )}
          </>
        )}
      </div>

      <MenuItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        menuItem={selectedItem}
        onSuccess={loadData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{itemToDelete?.name}". This action cannot be undone.
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

export default AdminMenu;
