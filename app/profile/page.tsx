'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, MapPin, CreditCard, Package, Heart, Settings,
  ShoppingBag, LogOut, Plus, Pencil, Trash2, Check,
} from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/components/store-provider';
import { products, formatINR } from '@/lib/data';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'details', label: 'Personal Details', icon: User },
  { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function ProfilePage() {
  const { wishlist, cart } = useStore();
  const [activeTab, setActiveTab] = useState('details');
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              {/* User card */}
              <div className="p-5 rounded-2xl border border-border bg-card mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                    JD
                  </div>
                  <div>
                    <div className="font-semibold">John Doe</div>
                    <div className="text-xs text-muted-foreground">john@example.com</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div><div className="text-lg font-bold">{cart.length}</div><div className="text-xs text-muted-foreground">Cart</div></div>
                  <div><div className="text-lg font-bold">{wishlist.length}</div><div className="text-xs text-muted-foreground">Wishlist</div></div>
                  <div><div className="text-lg font-bold">3</div><div className="text-xs text-muted-foreground">Orders</div></div>
                </div>
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      activeTab === tab.id ? 'bg-blue-600 text-white' : 'hover:bg-secondary'
                    )}
                  >
                    <tab.icon className="w-4.5 h-4.5" /> {tab.label}
                  </button>
                ))}
                <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                  <LogOut className="w-4.5 h-4.5" /> Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {activeTab === 'details' && (
                <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <h2 className="font-semibold text-lg">Personal Details</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label>First Name</Label><Input defaultValue="John" /></div>
                    <div><Label>Last Name</Label><Input defaultValue="Doe" /></div>
                    <div><Label>Email</Label><Input defaultValue="john@example.com" /></div>
                    <div><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
                    <div className="sm:col-span-2"><Label>Bio</Label><Input defaultValue="Tech enthusiast and gadget lover" /></div>
                  </div>
                  <Button className="rounded-full">Save Changes</Button>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg">Saved Addresses</h2>
                    <Button size="sm" className="rounded-full gap-2"><Plus className="w-4 h-4" /> Add New</Button>
                  </div>
                  {[
                    { id: 'a1', name: 'Home', line: '123 Main St, Mumbai, MH 400001', phone: '9876543210', default: true },
                    { id: 'a2', name: 'Office', line: '456 Tech Park, Bangalore, KA 560001', phone: '9876512345', default: false },
                  ].map((addr) => (
                    <div key={addr.id} className="p-4 rounded-2xl border border-border bg-card">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{addr.name}</span>
                            {addr.default && <Badge variant="secondary" className="text-xs">Default</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{addr.line}</p>
                          <p className="text-sm text-muted-foreground">Phone: {addr.phone}</p>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-2 rounded-full hover:bg-secondary"><Pencil className="w-4 h-4" /></button>
                          <button className="p-2 rounded-full hover:bg-secondary text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg">Payment Methods</h2>
                    <Button size="sm" className="rounded-full gap-2"><Plus className="w-4 h-4" /> Add Card</Button>
                  </div>
                  {[
                    { id: 'c1', type: 'Visa', last4: '4242', expiry: '12/26', default: true },
                    { id: 'c2', type: 'Mastercard', last4: '8888', expiry: '08/25', default: false },
                  ].map((card) => (
                    <div key={card.id} className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-md bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                          {card.type === 'Visa' ? 'VISA' : 'MC'}
                        </div>
                        <div>
                          <div className="text-sm font-medium">**** {card.last4}</div>
                          <div className="text-xs text-muted-foreground">Expires {card.expiry}</div>
                        </div>
                      </div>
                      {card.default && <Badge variant="secondary" className="text-xs">Default</Badge>}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-3">
                  <h2 className="font-semibold text-lg">Recent Orders</h2>
                  {[1, 2, 3].map((o) => (
                    <div key={o} className="p-4 rounded-2xl border border-border bg-card flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Order TN{o}X{Math.random().toString(36).slice(2, 6).toUpperCase()}</div>
                        <div className="text-xs text-muted-foreground">Jan 2024 · Delivered</div>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-full" asChild>
                        <Link href="/orders">View</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="space-y-3">
                  <h2 className="font-semibold text-lg">Wishlist ({wishlistProducts.length})</h2>
                  {wishlistProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">Your wishlist is empty</p>
                      <Button asChild variant="outline" className="rounded-full mt-4"><Link href="/products">Browse Products</Link></Button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {wishlistProducts.map((p) => (
                        <Link key={p.id} href={`/products/${p.slug}`} className="flex gap-3 p-3 rounded-2xl border border-border bg-card hover:shadow-soft transition-all">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary shrink-0">
                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-sm font-medium line-clamp-2">{p.name}</div>
                            <div className="text-sm font-bold mt-1">{formatINR(p.price)}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <h2 className="font-semibold text-lg">Settings</h2>
                  {[
                    { label: 'Email Notifications', desc: 'Receive order updates and promotions' },
                    { label: 'SMS Notifications', desc: 'Get delivery alerts via SMS' },
                    { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                    { label: 'Personalized Recommendations', desc: 'Get AI-powered product suggestions' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <div className="text-sm font-medium">{s.label}</div>
                        <div className="text-xs text-muted-foreground">{s.desc}</div>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-blue-600 relative">
                        <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
