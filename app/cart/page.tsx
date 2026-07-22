'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Minus, Trash2, Tag, Truck, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/components/store-provider';
import { coupons, formatINR } from '@/lib/data';
import { toast } from 'sonner';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: string } | null>(null);

  const applyCoupon = () => {
    const coupon = coupons.find((c) => c.code === couponCode.toUpperCase());
    if (!coupon) {
      toast.error('Invalid coupon code');
      return;
    }
    if (cartTotal < coupon.minOrder) {
      toast.error(`Minimum order of ${formatINR(coupon.minOrder)} required`);
      return;
    }
    const discount = coupon.type === 'percentage'
      ? Math.round((cartTotal * coupon.discount) / 100)
      : coupon.discount;
    setAppliedCoupon({ code: coupon.code, discount, type: coupon.type });
    toast.success(`Coupon ${coupon.code} applied! You saved ${formatINR(discount)}`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const discount = appliedCoupon?.discount || 0;
  const deliveryFee = cartTotal > 50000 ? 0 : 499;
  const finalTotal = cartTotal - discount + deliveryFee;

  if (cart.length === 0) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Browse our products and find something you love.</p>
          <Link href="/products"><Button className="rounded-full gap-2">Start Shopping <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Shopping Cart ({cart.length} items)</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 p-4 rounded-2xl border border-border bg-card"
                >
                  <Link href={`/products/${item.product.slug}`} className="shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-secondary">
                      <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/products/${item.product.slug}`}>
                          <h3 className="font-semibold hover:text-blue-600">{item.product.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 p-1 rounded-full border border-border">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 rounded-full hover:bg-secondary">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 rounded-full hover:bg-secondary">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatINR(item.product.price * item.quantity)}</div>
                        <div className="text-xs text-muted-foreground">{formatINR(item.product.price)} each</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-2">
              <Link href="/products"><Button variant="ghost" className="rounded-full">Continue Shopping</Button></Link>
              <Button variant="ghost" onClick={clearCart} className="text-red-500 rounded-full">Clear Cart</Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl border border-border bg-card space-y-4">
              <h2 className="font-semibold text-lg">Order Summary</h2>

              {/* Coupon */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="text-sm font-medium text-green-700 dark:text-green-400">{appliedCoupon.code}</div>
                        <div className="text-xs text-green-600">You saved {formatINR(appliedCoupon.discount)}</div>
                      </div>
                    </div>
                    <button onClick={removeCoupon}><X className="w-4 h-4 text-green-600" /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="rounded-full"
                    />
                    <Button variant="outline" onClick={applyCoupon} className="rounded-full shrink-0">Apply</Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">Try: TECHNEST10, SAVE2000, WELCOME15</p>
              </div>

              <Separator />

              {/* Price breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatINR(cartTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-blue-600">Add {formatINR(50000 - cartTotal)} more for free delivery</p>
                )}
              </div>

              <Separator />

              <div className="flex justify-between items-baseline">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">{formatINR(finalTotal)}</span>
              </div>

              {/* Delivery estimate */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 text-sm text-muted-foreground">
                <Truck className="w-4 h-4 text-blue-600" />
                Estimated delivery: 3-5 business days
              </div>

              <Link href="/checkout">
                <Button className="w-full rounded-full gap-2 shadow-glow" size="lg">
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
