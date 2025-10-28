import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag, Tag, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getDiscountAmount
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const subtotal = getTotalPrice();
  const deliveryFee = 3.99;
  const tax = subtotal * 0.08;
  const discount = getDiscountAmount();
  const total = subtotal + deliveryFee + tax - discount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    const success = applyCoupon(couponCode);
    if (success) {
      toast.success('Coupon applied successfully! 🎉');
      setCouponCode('');
    } else {
      toast.error('Invalid coupon code or minimum order not met');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.info('Coupon removed');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12">
          <Card className="max-w-md mx-auto text-center p-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add items from restaurants to get started</p>
            <Link to="/restaurants">
              <Button size="lg">Browse Restaurants</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemsCount={cartItems.length} />
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(({ item, quantity }) => (
              <Card key={item.id} className="card-hover card-shimmer group animate-slide-in-left">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0 image-zoom-hover">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">${item.price}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <Button size="sm" onClick={() => updateQuantity(item.id, quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {/* Coupon Section */}
                <div className="mb-4 p-4 bg-muted/50 rounded-lg border-2 border-dashed border-primary/30 card-hover">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">Have a coupon?</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-secondary animate-bounce-in">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-secondary" />
                        <div>
                          <p className="font-bold text-sm">{appliedCoupon.code}</p>
                          <p className="text-xs text-muted-foreground">
                            {appliedCoupon.type === 'percentage'
                              ? `${appliedCoupon.discount}% off`
                              : `$${appliedCoupon.discount} off`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveCoupon}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        className="text-sm"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        size="sm"
                        className="button-glow-pulse"
                      >
                        Apply
                      </Button>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Available codes:</p>
                    <div className="flex flex-wrap gap-1">
                      <code className="px-2 py-0.5 bg-background rounded text-primary">SAVE10</code>
                      <code className="px-2 py-0.5 bg-background rounded text-primary">SAVE20</code>
                      <code className="px-2 py-0.5 bg-background rounded text-primary">FLAT5</code>
                    </div>
                  </div>
                </div>

                <Separator className="mb-4" />

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm animate-bounce-in">
                      <span className="text-secondary font-medium">Discount</span>
                      <span className="font-bold text-secondary">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>

                <Link to="/restaurants">
                  <Button variant="outline" size="lg" className="w-full mt-3">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
