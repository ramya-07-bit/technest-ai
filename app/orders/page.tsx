'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, Truck, CheckCircle2, Clock, XCircle, Download, Eye } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatINR } from '@/lib/data';
import type { Order } from '@/types';

const dummyOrders: Order[] = [
  {
    id: 'TN8X4K2P',
    date: '2024-01-20',
    status: 'Delivered',
    total: 189999,
    items: [{ product: { id: 'p1', name: 'MacBook Pro 14" M3 Pro', slug: 'macbook-pro-14-m3-pro', brand: 'Apple', category: 'Laptops', price: 189999, rating: 4.8, reviewCount: 1243, stock: 15, description: '', images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'], specs: {}, features: [], tags: [], releaseDate: '' }, quantity: 1 }],
    address: { id: 'a1', name: 'John Doe', phone: '9876543210', line1: '123 Main St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    paymentMethod: 'Credit Card',
    trackingId: 'TRK123456789',
    estimatedDelivery: '2024-01-25',
  },
  {
    id: 'TN9Y5L3Q',
    date: '2024-01-18',
    status: 'Shipped',
    total: 29990,
    items: [{ product: { id: 'p12', name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', brand: 'Sony', category: 'Headphones', price: 29990, rating: 4.8, reviewCount: 2156, stock: 35, description: '', images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'], specs: {}, features: [], tags: [], releaseDate: '' }, quantity: 1 }],
    address: { id: 'a1', name: 'John Doe', phone: '9876543210', line1: '123 Main St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    paymentMethod: 'UPI',
    trackingId: 'TRK987654321',
    estimatedDelivery: '2024-01-23',
  },
  {
    id: 'TN7Z3M1R',
    date: '2024-01-15',
    status: 'Processing',
    total: 54990,
    items: [{ product: { id: 'p15', name: 'PlayStation 5 Slim', slug: 'playstation-5-slim', brand: 'Sony', category: 'Gaming', price: 54990, rating: 4.8, reviewCount: 4521, stock: 20, description: '', images: ['https://images.unsplash.com/photo-1607873202327-3c7cf5f7a3f6?w=400'], specs: {}, features: [], tags: [], releaseDate: '' }, quantity: 1 }],
    address: { id: 'a1', name: 'John Doe', phone: '9876543210', line1: '123 Main St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    paymentMethod: 'Credit Card',
    estimatedDelivery: '2024-01-28',
  },
];

const statusConfig = {
  Processing: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-950/30' },
  Shipped: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-950/30' },
  Delivered: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-950/30' },
  Cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-950/30' },
  'Out for Delivery': { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-950/30' },
};

export default function OrdersPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Order History</h1>

        <div className="space-y-4">
          {dummyOrders.map((order, i) => {
            const status = statusConfig[order.status];
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl border border-border bg-card"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{order.id}</span>
                      <Badge className={`${status.bg} ${status.color} border-0`} variant="outline">
                        <status.icon className="w-3 h-3 mr-1" /> {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatINR(order.total)}</div>
                    <div className="text-xs text-muted-foreground">{order.paymentMethod}</div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-secondary/40">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <Link href={`/products/${item.product.slug}`} className="text-sm font-medium hover:text-blue-600">{item.product.name}</Link>
                        <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-medium">{formatINR(item.product.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Tracking */}
                {order.trackingId && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Truck className="w-4 h-4 text-blue-600" />
                    Tracking ID: <span className="font-medium text-foreground">{order.trackingId}</span>
                    {order.estimatedDelivery && <span className="ml-2">· ETA: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</span>}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="rounded-full gap-1.5"><Eye className="w-3.5 h-3.5" /> View Details</Button>
                  <Button size="sm" variant="outline" className="rounded-full gap-1.5"><Download className="w-3.5 h-3.5" /> Invoice</Button>
                  {order.status === 'Processing' && (
                    <Button size="sm" variant="ghost" className="rounded-full text-red-500">Cancel Order</Button>
                  )}
                  {order.status === 'Delivered' && (
                    <Button size="sm" variant="ghost" className="rounded-full text-blue-600">Buy Again</Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
