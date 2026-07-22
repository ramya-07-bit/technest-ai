'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Sparkles, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/components/store-provider';
import { getBudgetBuild } from '@/services/ai';
import { formatINR } from '@/lib/data';
import type { Product } from '@/types';

export default function BudgetBuilderPage() {
  const { addToCart } = useStore();
  const [budget, setBudget] = useState(100000);
  const [build, setBuild] = useState<{ category: string; product: Product }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBuild = async () => {
    setLoading(true);
    setBuild([]);
    await new Promise((r) => setTimeout(r, 800));
    setBuild(getBudgetBuild(budget));
    setLoading(false);
  };

  const totalCost = build.reduce((s, item) => s + item.product.price, 0);
  const remaining = budget - totalCost;

  const addAllToCart = () => {
    build.forEach((item) => addToCart(item.product));
  };

  const quickBudgets = [50000, 100000, 150000, 200000, 300000];

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong mb-4">
            <Wallet className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Smart Budget Builder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Build Your Perfect Setup</h1>
          <p className="text-muted-foreground">Enter your budget and let AI create a complete tech setup for you</p>
        </div>

        {/* Budget input */}
        <div className="max-w-2xl mx-auto p-6 rounded-3xl border border-border bg-card mb-8">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Your Budget</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">₹</span>
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="pl-8 text-lg font-semibold h-14 rounded-2xl"
                  min={10000}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickBudgets.map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    budget === b ? 'bg-blue-600 text-white' : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  ₹{b.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <Button onClick={handleBuild} disabled={loading} className="w-full rounded-full gap-2 h-12" size="lg">
              <Sparkles className="w-5 h-5" />
              {loading ? 'Building your setup...' : 'Build My Setup'}
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl border border-border bg-card">
                <div className="w-24 h-24 rounded-xl bg-secondary animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-secondary rounded w-1/3 animate-pulse" />
                  <div className="h-4 bg-secondary rounded w-2/3 animate-pulse" />
                  <div className="h-8 bg-secondary rounded w-1/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {build.length > 0 && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Summary */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-white/80 mb-1">Your Complete Setup</div>
                  <div className="text-3xl font-bold">{formatINR(totalCost)}</div>
                  <div className="text-sm text-white/80 mt-1">
                    Budget: {formatINR(budget)} · Remaining: {formatINR(Math.max(0, remaining))}
                  </div>
                </div>
                <Button onClick={addAllToCart} className="bg-white text-blue-600 hover:bg-white/90 rounded-full gap-2" size="lg">
                  <ShoppingBag className="w-5 h-5" /> Add All to Cart
                </Button>
              </div>
            </div>

            {/* Build items */}
            <div className="space-y-3">
              {build.map((item, i) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-4 rounded-2xl border border-border bg-card hover:shadow-soft transition-all"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-secondary shrink-0">
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-1">{item.category}</Badge>
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold">{formatINR(item.product.price)}</span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((item.product.price / budget) * 100)}% of budget
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="rounded-full gap-1.5" onClick={() => addToCart(item.product)}>
                        <ShoppingBag className="w-3.5 h-3.5" /> Add
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-full gap-1.5" asChild>
                        <a href={`/products/${item.product.slug}`}>View Details <ArrowRight className="w-3.5 h-3.5" /></a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
