import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Store, Package, ShoppingCart, LogOut, UtensilsCrossed, Home, Trash2, Edit } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  image: string;
  address: string;
  isOpen: boolean;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantId: number;
  isVeg: boolean;
  rating: number;
}

interface Order {
  id: number;
  orderNumber: string;
  total: number;
  status: string;
  deliveryAddress: string;
  orderDate: string;
  items: any[];
}

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "VENDOR") {
      toast.error("Please login as a vendor");
      navigate("/auth");
      return;
    }

    fetchVendorData();
  }, [navigate]);

  const fetchVendorData = async () => {
    const token = localStorage.getItem("token");
    
    try {
      // Fetch restaurant details
      const restaurantRes = await fetch(`${API_BASE_URL}/api/vendor/restaurant`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (restaurantRes.ok) {
        const restaurantData = await restaurantRes.json();
        setRestaurant(restaurantData);
      } else {
        const error = await restaurantRes.json();
        toast.error(error.message || "Failed to load restaurant details");
      }

      // Fetch menu items
      const menuRes = await fetch(`${API_BASE_URL}/api/vendor/menu-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setMenuItems(menuData);
      }

      // Fetch orders
      const ordersRes = await fetch(`${API_BASE_URL}/api/vendor/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast.error("An error occurred while loading data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/vendor/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Order status updated successfully");
        fetchVendorData();
      } else {
        toast.error(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("An error occurred while updating order status");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      PREPARING: "bg-purple-100 text-purple-800",
      OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleDeleteMenuItem = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/vendor/menu-items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Menu item deleted successfully");
        fetchVendorData();
      } else {
        toast.error(data.message || "Failed to delete menu item");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("An error occurred while deleting the menu item");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Restaurant Found</CardTitle>
            <CardDescription>
              Your vendor account is not associated with any restaurant yet.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const activeOrders = orders.filter((o) =>
    ["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY"].includes(o.status)
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">
              Eat2Day <span className="text-orange-500">Vendor</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline">
              {restaurant?.name}
            </span>
            <Button variant="ghost" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button 
              onClick={handleLogout}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Manage your restaurant, menu, and orders</p>
        </div>

        {/* Restaurant Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Store className="h-8 w-8 text-orange-500" />
                <div>
                  <CardTitle>{restaurant.name}</CardTitle>
                  <CardDescription>{restaurant.cuisine} • {restaurant.address}</CardDescription>
                </div>
              </div>
              <Badge variant={restaurant.isOpen ? "default" : "secondary"}>
                {restaurant.isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
              <Package className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuItems.length}</div>
              <p className="text-xs text-muted-foreground">Active menu items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => navigate("/vendor/menu/add")} 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Menu Item
                </Button>
                <Button onClick={() => setActiveTab("orders")} variant="outline" className="w-full border-orange-200 hover:bg-orange-50">
                  View Orders
                </Button>
                <Button onClick={() => setActiveTab("menu")} variant="outline" className="w-full border-orange-200 hover:bg-orange-50">
                  Manage Menu
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.slice(0, 5).length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">₹{order.total.toFixed(2)}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Menu Items</h2>
              <Button 
                onClick={() => navigate("/vendor/menu/add")}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            {menuItems.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No menu items yet</p>
                  <Button 
                    onClick={() => navigate("/vendor/menu/add")}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Item
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Badge variant={item.isVeg ? "default" : "secondary"}>
                          {item.isVeg ? "Veg" : "Non-Veg"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-orange-500">₹{item.price}</span>
                        <span className="text-sm text-muted-foreground">{item.category}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => navigate(`/vendor/menu/edit/${item.id}`)}
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleDeleteMenuItem(item.id)}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">All Orders</h2>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.orderDate).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{order.deliveryAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-orange-500">₹{order.total.toFixed(2)}</p>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      </div>

                      {order.status === "PENDING" && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "CONFIRMED")}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          >
                            Confirm Order
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}

                      {order.status === "CONFIRMED" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "PREPARING")}
                          className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          Mark as Preparing
                        </Button>
                      )}

                      {order.status === "PREPARING" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "OUT_FOR_DELIVERY")}
                          className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          Mark as Out for Delivery
                        </Button>
                      )}

                      {order.status === "OUT_FOR_DELIVERY" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                          className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          Mark as Delivered
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
