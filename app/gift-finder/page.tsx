'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Heart, ShoppingBag } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductCard } from '@/components/product-card';
import { getGiftRecommendations } from '@/services/ai';

export default function GiftFinderPage() {
  const [recipient, setRecipient] = useState('');
  const [budget, setBudget] = useState(5000);
  const [results, setResults] = useState<ReturnType<typeof getGiftRecommendations> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFind = async () => {
    setLoading(true);
    setResults(null);
    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 800));
    setResults(getGiftRecommendations(budget, recipient || 'friend'));
    setLoading(false);
  };

  const quickOptions = [
    { label: 'Brother', value: 'brother' },
    { label: 'Sister', value: 'sister' },
    { label: 'Father', value: 'father' },
    { label: 'Mother', value: 'mother' },
    { label: 'Friend', value: 'friend' },
    { label: 'Partner', value: 'partner' },
  ];

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong mb-4">
            <Gift className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">AI-Powered Gift Finder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Find the Perfect Gift</h1>
          <p className="text-muted-foreground">Tell us who you're shopping for and your budget</p>
        </div>

        {/* Input form */}
        <div className="max-w-2xl mx-auto p-6 rounded-3xl border border-border bg-card mb-8">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Who is the gift for?</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {quickOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setRecipient(opt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      recipient === opt.value ? 'bg-blue-600 text-white' : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <Input
                placeholder="Or describe the person..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="rounded-full"
              />
            </div>

            <div>
              <Label className="mb-2 block">Budget: ₹{budget.toLocaleString('en-IN')}</Label>
              <input
                type="range"
                min={500}
                max={100000}
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>₹500</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            <Button onClick={handleFind} disabled={loading} className="w-full rounded-full gap-2 h-12" size="lg">
              <Sparkles className="w-5 h-5" />
              {loading ? 'Finding perfect gifts...' : 'Find Gift Ideas'}
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="aspect-square bg-secondary animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-secondary rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-secondary rounded animate-pulse" />
                  <div className="h-8 bg-secondary rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {results && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold">
                {results.length} gift ideas for {recipient || 'your friend'} under ₹{budget.toLocaleString('en-IN')}
              </h2>
            </div>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No gifts found in this budget</p>
                <p className="text-sm text-muted-foreground">Try increasing your budget</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
