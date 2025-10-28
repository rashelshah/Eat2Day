import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Package, Truck, MapPin, Loader2 } from 'lucide-react';
import { orderAPI } from '@/lib/api';
import { toast } from 'sonner';

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getById(orderId!);
      setOrder(data);
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Order not found</h1>
          <Link to="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const orderSteps = [
    { status: 'PENDING', label: 'Order Placed', icon: CheckCircle, time: order.orderDate },
    { status: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle, time: order.orderDate },
    { status: 'PREPARING', label: 'Preparing Food', icon: Package, time: null },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck, time: null },
    { status: 'DELIVERED', label: 'Delivered', icon: MapPin, time: order.estimatedDelivery },
  ];

  const currentStepIndex = orderSteps.findIndex((step) => step.status === order.status);
  const restaurant = order.restaurant || {};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/orders">
            <Button variant="ghost" className="mb-4">← Back to Orders</Button>
          </Link>
          <h1 className="text-3xl font-bold">Track Order</h1>
          <p className="text-muted-foreground">Order #{order.orderNumber}</p>
        </div>

        <div className="grid gap-6">
          {/* Order Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {orderSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                            isCompleted
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-muted bg-background'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {index < orderSteps.length - 1 && (
                          <div
                            className={`h-12 w-0.5 ${
                              isCompleted && !isCurrent ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        )}
                      </div>
                      
                      <div className={`flex-1 ${isCurrent ? '' : 'pt-2'}`}>
                        <h3
                          className={`font-semibold ${
                            isCurrent ? 'text-primary' : isCompleted ? '' : 'text-muted-foreground'
                          }`}
                        >
                          {step.label}
                        </h3>
                        {step.time && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(step.time).toLocaleTimeString()}
                          </p>
                        )}
                        {isCurrent && (
                          <p className="text-sm text-primary mt-1">In Progress</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{restaurant.name || 'Restaurant'}</h3>
                <p className="text-sm text-muted-foreground">{restaurant.address || 'Address not available'}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-semibold">Items</h4>
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.menuItem?.name || 'Item'}
                    </span>
                    <span className="font-medium">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(order.total - 3.99 - order.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>$3.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${(order.total * 0.1).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">${order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Delivery Address</h4>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </div>
            </CardContent>
          </Card>

          {/* Estimated Delivery */}
          {order.estimatedDelivery && order.status !== 'DELIVERED' && (
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8" />
                  <div>
                    <p className="text-sm opacity-90">Estimated Delivery</p>
                    <p className="text-xl font-bold">
                      {new Date(order.estimatedDelivery).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
