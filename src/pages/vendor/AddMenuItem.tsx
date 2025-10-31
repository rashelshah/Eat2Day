import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export default function AddMenuItem() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    isVeg: true,
    rating: "4.0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/vendor/menu-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          rating: parseFloat(formData.rating),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Menu item added successfully!");
        navigate("/vendor");
      } else {
        toast.error(data.message || "Failed to add menu item");
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.error("An error occurred while adding the menu item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/vendor")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add New Menu Item</h1>
          <p className="text-muted-foreground">Add a new dish to your restaurant menu</p>
        </div>

        {/* Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Menu Item Details
            </CardTitle>
            <CardDescription className="text-orange-50">
              Fill in the details for your new menu item
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g., Margherita Pizza"
                  value={formData.name}
                  onChange={handleChange}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Describe your dish..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    placeholder="299.00"
                    value={formData.price}
                    onChange={handleChange}
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="focus:ring-orange-500 focus:border-orange-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Appetizers">Appetizers</SelectItem>
                      <SelectItem value="Main Course">Main Course</SelectItem>
                      <SelectItem value="Desserts">Desserts</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                      <SelectItem value="Salads">Salads</SelectItem>
                      <SelectItem value="Soups">Soups</SelectItem>
                      <SelectItem value="Pizza">Pizza</SelectItem>
                      <SelectItem value="Pasta">Pasta</SelectItem>
                      <SelectItem value="Burgers">Burgers</SelectItem>
                      <SelectItem value="Sandwiches">Sandwiches</SelectItem>
                      <SelectItem value="Rice">Rice</SelectItem>
                      <SelectItem value="Biryani">Biryani</SelectItem>
                      <SelectItem value="Curries">Curries</SelectItem>
                      <SelectItem value="Breads">Breads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  required
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-sm text-muted-foreground">
                  Provide a URL to an image of your dish
                </p>
              </div>

              {/* Rating and Veg Switch Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Initial Rating *</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                    value={formData.rating}
                    onChange={handleChange}
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isVeg">Vegetarian</Label>
                  <div className="flex items-center space-x-2 h-10">
                    <Switch
                      id="isVeg"
                      checked={formData.isVeg}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, isVeg: checked }))
                      }
                    />
                    <Label htmlFor="isVeg" className="cursor-pointer">
                      {formData.isVeg ? "Veg" : "Non-Veg"}
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-6 text-lg"
                >
                  {isSubmitting ? "Adding..." : "Add Menu Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
