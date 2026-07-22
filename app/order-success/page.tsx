'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Truck, Home, ShoppingBag } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/data';

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get('id') || '';
  const [order, setOrder] = useState<{ id: string; total: number; items: { name: string; quantity: number; price: number }[]; date: string } | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('last-order');
      if (saved) setOrder(JSON.parse(saved));
    } catch {}
  }, []);

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your purchase. Your order is being processed.</p>
          {orderId && <p className="text-sm font-medium mt-2">Order ID: <span className="text-blue-600">{orderId}</span></p>}
        </motion.div>

        {/* Order details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl border border-border bg-card mb-6"
          >
            <h2 className="font-semibold mb-4">Order Details</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-medium">{formatINR(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-4 flex justify-between items-baseline">
              <span className="font-semibold">Total Paid</span>
              <span className="text-xl font-bold">{formatINR(order.total)}</span>
            </div>
          </motion.div>
        )}

        {/* Tracking timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border border-border bg-card mb-6"
        >
          <h2 className="font-semibold mb-4">Order Status</h2>
          <div className="space-y-4">
            {[
              { icon: CheckCircle2, label: 'Order Confirmed', desc: 'Your order has been placed', done: true },
              { icon: Package, label: 'Processing', desc: 'We are preparing your order', done: false },
              { icon: Truck, label: 'Shipped', desc: 'On the way to your address', done: false },
              { icon: Home, label: 'Delivered', desc: 'Expected in 3-5 days', done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-green-500 text-white' : 'bg-secondary text-muted-foreground'}`}>
                  <step.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className={`text-sm font-medium ${step.done ? '' : 'text-muted-foreground'}`}>{step.label}</div>
                  <div className="text-xs text-muted-foreground">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex gap-3 justify-center">
          <Link href="/orders"><Button variant="outline" className="rounded-full gap-2"><Package className="w-4 h-4" /> Track Order</Button></Link>
          <Link href="/products"><Button className="rounded-full gap-2"><ShoppingBag className="w-4 h-4" /> Continue Shopping</Button></Link>
        </div>
      </div>
    </PageShell>
  );
}
