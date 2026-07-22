'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CreditCard, ClipboardCheck, Check, MapPin, Wallet, Banknote, Shield } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStore } from '@/components/store-provider';
import { formatINR } from '@/lib/data';
import { cn } from '@/lib/utils';

const steps = ['Shipping', 'Delivery', 'Payment', 'Review'];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useStore();
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryOption, setDeliveryOption] = useState('standard');

  const deliveryFee = deliveryOption === 'express' ? 299 : cartTotal > 50000 ? 0 : 499;
  const finalTotal = cartTotal + deliveryFee;

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart.length, router]);

  if (cart.length === 0) {
    return null;
  }

  const handlePlaceOrder = () => {
    const orderId = 'TN' + Math.random().toString(36).slice(2, 10).toUpperCase();
    sessionStorage.setItem('last-order', JSON.stringify({
      id: orderId,
      total: finalTotal,
      items: cart.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
      date: new Date().toISOString(),
    }));
    clearCart();
    router.push(`/order-success?id=${orderId}`);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 max-w-2xl">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white shadow-glow' : 'bg-secondary text-muted-foreground'
                )}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn('text-xs', i === step ? 'font-medium' : 'text-muted-foreground')}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('flex-1 h-0.5 mx-2 -mt-4', i < step ? 'bg-green-500' : 'bg-border')} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {step === 0 && (
                <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h2 className="font-semibold">Shipping Address</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label>Full Name</Label><Input placeholder="John Doe" /></div>
                    <div><Label>Phone</Label><Input placeholder="+91 98765 43210" /></div>
                    <div className="sm:col-span-2"><Label>Address Line 1</Label><Input placeholder="House no, Street" /></div>
                    <div className="sm:col-span-2"><Label>Address Line 2</Label><Input placeholder="Area, Landmark" /></div>
                    <div><Label>City</Label><Input placeholder="Mumbai" /></div>
                    <div><Label>State</Label><Input placeholder="Maharashtra" /></div>
                    <div><Label>Pincode</Label><Input placeholder="400001" /></div>
                  </div>
                  <Button onClick={() => setStep(1)} className="rounded-full">Continue to Delivery</Button>
                </motion.div>
              )}

              {/* Step 2: Delivery */}
              {step === 1 && (
                <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <h2 className="font-semibold">Delivery Options</h2>
                  </div>
                  <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                    <div className={cn('flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors', deliveryOption === 'standard' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20' : 'border-border')} onClick={() => setDeliveryOption('standard')}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <div>
                          <div className="font-medium text-sm">Standard Delivery</div>
                          <div className="text-xs text-muted-foreground">3-5 business days</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{cartTotal > 50000 ? 'FREE' : '₹499'}</div>
                    </div>
                    <div className={cn('flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors', deliveryOption === 'express' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20' : 'border-border')} onClick={() => setDeliveryOption('express')}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" id="express" />
                        <div>
                          <div className="font-medium text-sm">Express Delivery</div>
                          <div className="text-xs text-muted-foreground">1-2 business days</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">₹299</div>
                    </div>
                  </RadioGroup>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(0)} className="rounded-full">Back</Button>
                    <Button onClick={() => setStep(2)} className="rounded-full">Continue to Payment</Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === 2 && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <h2 className="font-semibold">Payment Method</h2>
                  </div>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className={cn('flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors', paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20' : 'border-border')} onClick={() => setPaymentMethod('card')}>
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="w-5 h-5" />
                      <span className="text-sm font-medium">Credit / Debit Card</span>
                    </div>
                    <div className={cn('flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors', paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20' : 'border-border')} onClick={() => setPaymentMethod('upi')}>
                      <RadioGroupItem value="upi" id="upi" />
                      <Wallet className="w-5 h-5" />
                      <span className="text-sm font-medium">UPI / Wallet</span>
                    </div>
                    <div className={cn('flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors', paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20' : 'border-border')} onClick={() => setPaymentMethod('cod')}>
                      <RadioGroupItem value="cod" id="cod" />
                      <Banknote className="w-5 h-5" />
                      <span className="text-sm font-medium">Cash on Delivery</span>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'card' && (
                    <div className="space-y-3 pt-2">
                      <div><Label>Card Number</Label><Input placeholder="1234 5678 9012 3456" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Expiry</Label><Input placeholder="MM/YY" /></div>
                        <div><Label>CVV</Label><Input placeholder="123" type="password" /></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-600" /> Your payment information is encrypted and secure.
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-full">Back</Button>
                    <Button onClick={() => setStep(3)} className="rounded-full">Review Order</Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review */}
              {step === 3 && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardCheck className="w-5 h-5 text-blue-600" />
                    <h2 className="font-semibold">Order Review</h2>
                  </div>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0">
                          <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.product.name}</div>
                          <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-sm font-bold">{formatINR(item.product.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="rounded-full">Back</Button>
                    <Button onClick={handlePlaceOrder} className="rounded-full gap-2 flex-1 shadow-glow" size="lg">
                      Place Order · {formatINR(finalTotal)}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl border border-border bg-card space-y-3">
              <h2 className="font-semibold">Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(cartTotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span></div>
              </div>
              <Separator />
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">{formatINR(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
