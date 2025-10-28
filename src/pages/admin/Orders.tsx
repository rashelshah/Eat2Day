import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { orderAPI } from '@/lib/api';

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderAPI.getAll();
      setOrders(data);
    } catch (error: any) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (orderId: string, orderNumber: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success(`Order ${orderNumber} status updated to ${newStatus}`);
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
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
        {status?.replace(/_/g, ' ')}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Orders</h1>
          <p className="text-muted-foreground">Track and update order status</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="PREPARING">Preparing</SelectItem>
              <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              return (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {order.restaurant?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.orderDate).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Customer: {order.user?.firstName} {order.user?.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${order.total?.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="font-medium text-sm">Items:</p>
                      {order.items?.map((item: any, idx: number) => (
                        <p key={idx} className="text-sm text-muted-foreground">
                          {item.quantity}x {item.menuItem?.name} - ${item.price?.toFixed(2)}
                        </p>
                      ))}
                    </div>

                    <div className="mb-4">
                      <p className="font-medium text-sm mb-1">Delivery Address:</p>
                      <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {order.status === 'PENDING' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(order.id, order.orderNumber, 'CONFIRMED')}>
                          Confirm Order
                        </Button>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(order.id, order.orderNumber, 'PREPARING')}>
                          Start Preparing
                        </Button>
                      )}
                      {order.status === 'PREPARING' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(order.id, order.orderNumber, 'OUT_FOR_DELIVERY')}>
                          Out for Delivery
                        </Button>
                      )}
                      {order.status === 'OUT_FOR_DELIVERY' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(order.id, order.orderNumber, 'DELIVERED')}>
                          Mark Delivered
                        </Button>
                      )}
                      {['PENDING', 'CONFIRMED'].includes(order.status) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, order.orderNumber, 'CANCELLED')}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
