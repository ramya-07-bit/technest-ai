'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Users, BarChart3, Star,
  Ticket, Settings, TrendingUp, TrendingDown, DollarSign,
  ShoppingBag, AlertTriangle, Menu, X,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { products, formatINR } from '@/lib/data';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'inventory', label: 'Inventory', icon: AlertTriangle },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'coupons', label: 'Coupons', icon: Ticket },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const salesData = [
  { month: 'Jan', sales: 420000, revenue: 380000, orders: 142 },
  { month: 'Feb', sales: 510000, revenue: 460000, orders: 168 },
  { month: 'Mar', sales: 480000, revenue: 430000, orders: 155 },
  { month: 'Apr', sales: 620000, revenue: 560000, orders: 198 },
  { month: 'May', sales: 590000, revenue: 530000, orders: 187 },
  { month: 'Jun', sales: 710000, revenue: 640000, orders: 224 },
  { month: 'Jul', sales: 680000, revenue: 610000, orders: 215 },
  { month: 'Aug', sales: 790000, revenue: 710000, orders: 251 },
  { month: 'Sep', sales: 850000, revenue: 770000, orders: 268 },
  { month: 'Oct', sales: 920000, revenue: 830000, orders: 289 },
  { month: 'Nov', sales: 1100000, revenue: 990000, orders: 342 },
  { month: 'Dec', sales: 1250000, revenue: 1120000, orders: 387 },
];

const visitorData = [
  { day: 'Mon', visitors: 4200, conversions: 210 },
  { day: 'Tue', visitors: 3800, conversions: 180 },
  { day: 'Wed', visitors: 5100, conversions: 280 },
  { day: 'Thu', visitors: 4600, conversions: 240 },
  { day: 'Fri', visitors: 6200, conversions: 340 },
  { day: 'Sat', visitors: 7800, conversions: 420 },
  { day: 'Sun', visitors: 5400, conversions: 290 },
];

const categoryData = [
  { name: 'Laptops', value: 35, color: 'hsl(221, 83%, 53%)' },
  { name: 'Mobiles', value: 28, color: 'hsl(160, 84%, 39%)' },
  { name: 'Gaming', value: 15, color: 'hsl(35, 92%, 55%)' },
  { name: 'Headphones', value: 12, color: 'hsl(280, 65%, 60%)' },
  { name: 'Smart Watches', value: 6, color: 'hsl(340, 75%, 55%)' },
  { name: 'Cameras', value: 4, color: 'hsl(200, 70%, 50%)' },
];

const customerGrowth = [
  { month: 'Jan', customers: 1200 },
  { month: 'Feb', customers: 1450 },
  { month: 'Mar', customers: 1680 },
  { month: 'Apr', customers: 1920 },
  { month: 'May', customers: 2240 },
  { month: 'Jun', customers: 2580 },
  { month: 'Jul', customers: 2890 },
  { month: 'Aug', customers: 3210 },
  { month: 'Sep', customers: 3650 },
  { month: 'Oct', customers: 4100 },
  { month: 'Nov', customers: 4680 },
  { month: 'Dec', customers: 5240 },
];

const stats = [
  { label: 'Total Revenue', value: '₹1.12Cr', change: '+18.2%', trend: 'up', icon: DollarSign, color: 'text-green-600' },
  { label: 'Total Orders', value: '3,847', change: '+12.5%', trend: 'up', icon: ShoppingBag, color: 'text-blue-600' },
  { label: 'Customers', value: '5,240', change: '+8.3%', trend: 'up', icon: Users, color: 'text-purple-600' },
  { label: 'Conversion Rate', value: '4.8%', change: '-0.5%', trend: 'down', icon: TrendingUp, color: 'text-amber-600' },
];

const topProducts = products.slice(0, 5).map((p, i) => ({
  ...p,
  sold: [342, 289, 256, 198, 167][i],
  revenue: [342, 289, 256, 198, 167][i] * p.price,
}));

const lowStockProducts = products.filter((p) => p.stock < 15).slice(0, 5);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/20 flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-slate-950 border-r border-border flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">TechNest AI</div>
              <div className="text-xs text-muted-foreground">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                activeTab === item.id ? 'bg-blue-600 text-white' : 'hover:bg-secondary'
              )}
            >
              <item.icon className="w-4.5 h-4.5" /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">A</div>
            <div>
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-muted-foreground">admin@technest.ai</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="text-lg font-semibold capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Live</Badge>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-2xl border border-border bg-white dark:bg-slate-950"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn('w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center', stat.color)}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className={cn('flex items-center gap-1 text-xs font-medium', stat.trend === 'up' ? 'text-green-600' : 'text-red-500')}>
                        {stat.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Revenue chart */}
                <div className="p-5 rounded-2xl border border-border bg-white dark:bg-slate-950">
                  <h3 className="font-semibold mb-4">Monthly Revenue</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                      <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: '12px', border: '1px solid hsl(214, 32%, 91%)' }} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(221, 83%, 53%)" strokeWidth={2} fill="url(#revGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Category pie */}
                <div className="p-5 rounded-2xl border border-border bg-white dark:bg-slate-950">
                  <h3 className="font-semibold mb-4">Sales by Category</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                        {categoryData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                {/* Visitors */}
                <div className="p-5 rounded-2xl border border-border bg-white dark:bg-slate-950 lg:col-span-2">
                  <h3 className="font-semibold mb-4">Weekly Visitors & Conversions</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={visitorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                      <Tooltip contentStyle={{ borderRadius: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="visitors" fill="hsl(221, 83%, 53%)" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="conversions" fill="hsl(160, 84%, 39%)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Customer growth */}
                <div className="p-5 rounded-2xl border border-border bg-white dark:bg-slate-950">
                  <h3 className="font-semibold mb-4">Customer Growth</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={customerGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                      <YAxis tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                      <Tooltip contentStyle={{ borderRadius: '12px' }} />
                      <Line type="monotone" dataKey="customers" stroke="hsl(280, 65%, 60%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top products & low stock */}
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-border bg-white dark:bg-slate-950">
                  <h3 className="font-semibold mb-4">Top Products</h3>
                  <div className="space-y-3">
                    {topProducts.map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="text-sm font-medium text-muted-foreground w-5">#{i + 1}</div>
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary shrink-0">
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.sold} sold</div>
                        </div>
                        <div className="text-sm font-bold">{formatINR(p.revenue)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-white dark:bg-slate-950">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
                    <h3 className="font-semibold">Low Stock Alerts</h3>
                  </div>
                  <div className="space-y-3">
                    {lowStockProducts.map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary shrink-0">
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.brand}</div>
                        </div>
                        <Badge variant={p.stock < 10 ? 'destructive' : 'secondary'} className="text-xs">
                          {p.stock} left
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Page Views', value: '1.2M', change: '+15%' },
                  { label: 'Avg Session', value: '4m 32s', change: '+8%' },
                  { label: 'Bounce Rate', value: '32%', change: '-3%' },
                  { label: 'Conversion', value: '4.8%', change: '+0.5%' },
                ].map((s) => (
                  <div key={s.label} className="p-5 rounded-2xl border border-border bg-white dark:bg-slate-950">
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="text-2xl font-bold mt-1">{s.value}</div>
                    <div className="text-xs text-green-600 mt-1">{s.change}</div>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-2xl border border-border bg-white dark:bg-slate-950">
                <h3 className="font-semibold mb-4">Sales & Revenue Overview</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="salesG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                    <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" dataKey="sales" stroke="hsl(221, 83%, 53%)" strokeWidth={2} fill="url(#salesG)" />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fill="url(#revG)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="p-5 rounded-2xl border border-border bg-white dark:bg-slate-950 overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border text-left text-sm text-muted-foreground">
                      <th className="pb-3">Product</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Stock</th>
                      <th className="pb-3">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary shrink-0">
                              <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-sm font-medium">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm">{p.category}</td>
                        <td className="py-3 text-sm font-medium">{formatINR(p.price)}</td>
                        <td className="py-3"><Badge variant={p.stock < 15 ? 'destructive' : 'secondary'} className="text-xs">{p.stock}</Badge></td>
                        <td className="py-3 text-sm">{p.rating}★</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl border border-border bg-white dark:bg-slate-950 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.brand} · {p.category}</div>
                  </div>
                  <div className="w-32">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Stock: {p.stock}</span>
                      <span className={p.stock < 15 ? 'text-red-500' : 'text-green-600'}>{p.stock < 15 ? 'Low' : 'OK'}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className={cn('h-full rounded-full', p.stock < 10 ? 'bg-red-500' : p.stock < 20 ? 'bg-amber-500' : 'bg-green-500')} style={{ width: `${Math.min(p.stock / 60 * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 rounded-2xl border border-border bg-white dark:bg-slate-950">
              <table className="w-full">
                <thead><tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3">Order ID</th><th className="pb-3">Customer</th><th className="pb-3">Date</th><th className="pb-3">Total</th><th className="pb-3">Status</th>
                </tr></thead>
                <tbody>
                  {[
                    { id: 'TN8X4K2P', customer: 'John Doe', date: 'Jan 20', total: 189999, status: 'Delivered' },
                    { id: 'TN9Y5L3Q', customer: 'Priya Patel', date: 'Jan 19', total: 29990, status: 'Shipped' },
                    { id: 'TN7Z3M1R', customer: 'Rohan Mehta', date: 'Jan 18', total: 54990, status: 'Processing' },
                    { id: 'TN6A2N4S', customer: 'Kavya Reddy', date: 'Jan 17', total: 79990, status: 'Delivered' },
                    { id: 'TN5B1O5T', customer: 'Vikram Singh', date: 'Jan 16', total: 39999, status: 'Cancelled' },
                  ].map((o) => (
                    <tr key={o.id} className="border-b border-border last:border-0">
                      <td className="py-3 text-sm font-medium">{o.id}</td>
                      <td className="py-3 text-sm">{o.customer}</td>
                      <td className="py-3 text-sm text-muted-foreground">{o.date}</td>
                      <td className="py-3 text-sm font-medium">{formatINR(o.total)}</td>
                      <td className="py-3"><Badge variant={o.status === 'Delivered' ? 'default' : o.status === 'Cancelled' ? 'destructive' : 'secondary'} className="text-xs">{o.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'customers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'John Doe', email: 'john@example.com', orders: 12, spent: 234000 },
                { name: 'Priya Patel', email: 'priya@example.com', orders: 8, spent: 156000 },
                { name: 'Rohan Mehta', email: 'rohan@example.com', orders: 15, spent: 312000 },
                { name: 'Kavya Reddy', email: 'kavya@example.com', orders: 6, spent: 89000 },
                { name: 'Vikram Singh', email: 'vikram@example.com', orders: 9, spent: 178000 },
                { name: 'Sneha Gupta', email: 'sneha@example.com', orders: 4, spent: 67000 },
              ].map((c) => (
                <div key={c.email} className="p-5 rounded-2xl border border-border bg-white dark:bg-slate-950">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {c.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.email}</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div><div className="text-muted-foreground text-xs">Orders</div><div className="font-medium">{c.orders}</div></div>
                    <div><div className="text-muted-foreground text-xs">Total Spent</div><div className="font-medium">{formatINR(c.spent)}</div></div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {products.slice(0, 6).map((p) => (
                <div key={p.id} className="p-4 rounded-2xl border border-border bg-white dark:bg-slate-950 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.reviewCount} reviews</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold">{p.rating}</span>
                    <span className="text-amber-400">★</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'coupons' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {[
                { code: 'TECHNEST10', discount: '10%', uses: 1240, status: 'Active' },
                { code: 'SAVE2000', discount: '₹2000', uses: 856, status: 'Active' },
                { code: 'WELCOME15', discount: '15%', uses: 423, status: 'Active' },
                { code: 'BLACKFRIDAY', discount: '25%', uses: 3210, status: 'Expired' },
              ].map((c) => (
                <div key={c.code} className="p-4 rounded-2xl border border-border bg-white dark:bg-slate-950 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold">{c.code}</div>
                    <div className="text-xs text-muted-foreground">{c.discount} off · {c.uses} times used</div>
                  </div>
                  <Badge variant={c.status === 'Active' ? 'default' : 'secondary'} className="text-xs">{c.status}</Badge>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-2xl border border-border bg-white dark:bg-slate-950 space-y-4">
              <h2 className="font-semibold text-lg">Store Settings</h2>
              {['Enable AI Recommendations', 'Auto-approve Reviews', 'Low Stock Notifications', 'Email Order Updates'].map((s) => (
                <div key={s} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <span className="text-sm font-medium">{s}</span>
                  <button className="w-12 h-6 rounded-full bg-blue-600 relative">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
