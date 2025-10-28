import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { restaurantAPI } from '@/lib/api';

interface RestaurantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant?: any;
  onSuccess: () => void;
}

const RestaurantDialog = ({ open, onOpenChange, restaurant, onSuccess }: RestaurantDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    rating: '4.0',
    deliveryTime: '',
    minOrder: '',
    image: '',
    address: '',
    isOpen: true
  });

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        cuisine: restaurant.cuisine || '',
        rating: restaurant.rating?.toString() || '4.0',
        deliveryTime: restaurant.deliveryTime || '',
        minOrder: restaurant.minOrder?.toString() || '',
        image: restaurant.image || '',
        address: restaurant.address || '',
        isOpen: restaurant.isOpen !== undefined ? restaurant.isOpen : true
      });
    } else {
      setFormData({
        name: '',
        cuisine: '',
        rating: '4.0',
        deliveryTime: '',
        minOrder: '',
        image: '',
        address: '',
        isOpen: true
      });
    }
  }, [restaurant, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        cuisine: formData.cuisine,
        rating: parseFloat(formData.rating),
        deliveryTime: formData.deliveryTime,
        minOrder: parseFloat(formData.minOrder),
        image: formData.image,
        address: formData.address,
        isOpen: formData.isOpen
      };

      if (restaurant) {
        await restaurantAPI.update(restaurant.id, payload);
        toast.success('Restaurant updated successfully');
      } else {
        await restaurantAPI.create(payload);
        toast.success('Restaurant created successfully');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save restaurant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{restaurant ? 'Edit Restaurant' : 'Add Restaurant'}</DialogTitle>
          <DialogDescription>
            {restaurant ? 'Update the restaurant details below' : 'Fill in the details to create a new restaurant'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisine">Cuisine *</Label>
              <Input
                id="cuisine"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                placeholder="e.g., Italian, Chinese, Indian"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Delivery Time *</Label>
              <Input
                id="deliveryTime"
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                placeholder="e.g., 25-35 min"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrder">Min Order ($) *</Label>
              <Input
                id="minOrder"
                type="number"
                step="0.01"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isOpen"
              checked={formData.isOpen}
              onCheckedChange={(checked) => setFormData({ ...formData, isOpen: checked })}
              disabled={isLoading}
            />
            <Label htmlFor="isOpen">Restaurant is Open</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : restaurant ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantDialog;

