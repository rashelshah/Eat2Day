import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Home, UtensilsCrossed, Package, Settings, LogOut, Store, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

interface NavbarProps {
  cartItemsCount?: number;
}

const Navbar = ({ cartItemsCount }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isAdmin = location.pathname.startsWith('/admin');

  // Use cart context count if not provided as prop
  const actualCartCount = cartItemsCount !== undefined ? cartItemsCount : getTotalItems();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gradient">Eat2Day</span>
        </Link>

        {!isAdmin ? (
          <>
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Home
              </Link>
              <Link
                to="/restaurants"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/restaurants' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Restaurants
              </Link>
              <Link
                to="/orders"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/orders' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                My Orders
              </Link>
              <Link
                to="/apply-restaurant"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/apply-restaurant' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Partner with Us
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/cart">
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {actualCartCount > 0 && (
                    <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
                      {actualCartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.firstName}
                  </span>
                  <Link to="/profile">
                    <Button variant="outline" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4 flex-1 justify-between">
            <div className="flex items-center gap-2">
              <Link to="/admin" className={location.pathname === '/admin' ? 'text-primary' : ''}>
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/admin/restaurants" className={location.pathname === '/admin/restaurants' ? 'text-primary' : ''}>
                <Button variant="ghost" size="sm">
                  <UtensilsCrossed className="h-4 w-4 mr-2" />
                  Restaurants
                </Button>
              </Link>
              <Link to="/admin/orders" className={location.pathname === '/admin/orders' ? 'text-primary' : ''}>
                <Button variant="ghost" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <Link to="/admin/menu" className={location.pathname === '/admin/menu' ? 'text-primary' : ''}>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Menu
                </Button>
              </Link>
              <Link to="/admin/applications" className={location.pathname === '/admin/applications' ? 'text-primary' : ''}>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Applications
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {isLoggedIn && user && (
                <>
                  <span className="text-sm text-muted-foreground">
                    Admin: {user?.firstName}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
