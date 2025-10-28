import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, XCircle, Package, Loader2 } from 'lucide-react';
import { orderAPI } from '@/lib/api';
import { toast } from 'sonner';

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders from API...');
      const data = await orderAPI.getByUser();
      console.log('Orders received from API:', data);
      console.log('Type of data:', typeof data);
      console.log('Is array?', Array.isArray(data));
      console.log('Data keys:', data ? Object.keys(data) : 'null');
      
      // Handle different response formats
      let ordersArray = [];
      if (Array.isArray(data)) {
        ordersArray = data;
      } else if (data && typeof data === 'object') {
        // Check if it's an empty object
        const keys = Object.keys(data);
        if (keys.length === 0) {
          console.log('Received empty object, setting orders to empty array');
          ordersArray = [];
        } else if (Array.isArray((data as any).data)) {
          ordersArray = (data as any).data;
        } else if (Array.isArray((data as any).orders)) {
          ordersArray = (data as any).orders;
        } else if (keys.length > 0) {
          // If it's a single order object with properties, wrap it in an array
          ordersArray = [data];
        }
      }
      
      console.log('Final orders array:', ordersArray);
      console.log('Number of orders:', ordersArray.length);
      setOrders(ordersArray);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      await orderAPI.cancel(orderId);
      toast.success('Order cancelled successfully');
      // Refresh orders
      await fetchOrders();
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-secondary" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-accent" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const variants: { [key: string]: any } = {
      pending: 'outline',
      confirmed: 'secondary',
      preparing: 'secondary',
      out_for_delivery: 'default',
      delivered: 'secondary',
      cancelled: 'destructive',
    };

    return (
      <Badge variant={variants[statusLower] || 'outline'} className="capitalize">
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const activeOrders = orders.filter((order) =>
    ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status)
  );

  const pastOrders = orders.filter((order) =>
    ['DELIVERED', 'CANCELLED'].includes(order.status)
  );

  const renderOrderCard = (order: any) => {
    const canCancel = ['PENDING', 'CONFIRMED', 'PREPARING'].includes(order.status);
    const isCancelling = cancellingOrderId === order.id.toString();
    
    return (
      <Card key={order.id} className="hover:shadow-food-card transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="mt-1">{getStatusIcon(order.status)}</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {order.restaurant?.name || 'Restaurant'}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  Order #{order.orderNumber}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(order.orderDate).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.items?.map((item: any, idx: number) => (
                    <span key={idx} className="text-sm text-muted-foreground">
                      {item.quantity}x {item.menuItem?.name || 'Item'}
                      {idx < order.items.length - 1 && ','}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(order.status)}
              <p className="text-lg font-bold mt-2">${order.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Link to={`/track/${order.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Track Order
              </Button>
            </Link>
            {canCancel && (
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => handleCancelOrder(order.id.toString())}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Order'
                )}
              </Button>
            )}
            {order.status === 'DELIVERED' && (
              <Button className="flex-1">Reorder</Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">
              Active Orders ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Orders ({pastOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeOrders.length > 0 ? (
              activeOrders.map(renderOrderCard)
            ) : (
              <Card className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No active orders</h3>
                <p className="text-muted-foreground mb-6">
                  Start ordering from your favorite restaurants
                </p>
                <Link to="/restaurants">
                  <Button>Browse Restaurants</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastOrders.length > 0 ? (
              pastOrders.map(renderOrderCard)
            ) : (
              <Card className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No past orders</h3>
                <p className="text-muted-foreground">Your order history will appear here</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;
