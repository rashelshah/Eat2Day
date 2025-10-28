import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      icon: DollarSign,
      color: 'text-secondary',
    },
    {
      title: 'Orders Today',
      value: '245',
      change: '+12.5%',
      icon: ShoppingBag,
      color: 'text-primary',
    },
    {
      title: 'Active Customers',
      value: '1,234',
      change: '+8.3%',
      icon: Users,
      color: 'text-accent',
    },
    {
      title: 'Growth',
      value: '23.4%',
      change: '+4.2%',
      icon: TrendingUp,
      color: 'text-secondary',
    },
  ];

  const recentOrders = [
    { id: 'ORD123', customer: 'John Doe', amount: 45.99, status: 'Delivered' },
    { id: 'ORD124', customer: 'Jane Smith', amount: 32.50, status: 'Out for Delivery' },
    { id: 'ORD125', customer: 'Bob Johnson', amount: 58.75, status: 'Preparing' },
    { id: 'ORD126', customer: 'Alice Brown', amount: 27.99, status: 'Confirmed' },
    { id: 'ORD127', customer: 'Charlie Wilson', amount: 41.25, status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your food ordering platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={stat.title}
              className="card-hover group stagger-item"
              style={{ transform: 'translateY(20px)' }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                  <span className="text-sm font-medium text-secondary animate-pulse">{stat.change}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold group-hover:text-primary transition-colors">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.amount}</p>
                      <p className="text-sm text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Items */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Margherita Pizza', orders: 89, revenue: '$1,156' },
                  { name: 'Classic Burger', orders: 76, revenue: '$835' },
                  { name: 'Sushi Platter', orders: 63, revenue: '$1,574' },
                  { name: 'Caesar Salad', orders: 54, revenue: '$486' },
                  { name: 'Pepperoni Pizza', orders: 48, revenue: '$719' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.orders} orders</p>
                      </div>
                    </div>
                    <p className="font-semibold">{item.revenue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
