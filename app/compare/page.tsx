'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GitCompare, X, Sparkles, Trophy, Check, AlertCircle, Star, ShoppingBag } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/components/store-provider';
import { products, formatINR } from '@/lib/data';
import { getAIComparison } from '@/services/ai';
import type { Product, ComparisonResult } from '@/types';
import { cn } from '@/lib/utils';

export default function ComparePage() {
  const { addToCart } = useStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(true);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('compare-items') || '[]');
      if (saved.length >= 2) {
        setSelectedIds(saved);
        setShowPicker(false);
      }
    } catch {}
  }, []);

  const selectedProducts = selectedIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
    setComparison(null);
  };

  const runComparison = async () => {
    if (selectedIds.length < 2) return;
    setLoading(true);
    setShowPicker(false);
    const result = await getAIComparison(selectedIds);
    setComparison(result);
    setLoading(false);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong mb-4">
            <GitCompare className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">AI-Powered Comparison</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Compare Products</h1>
          <p className="text-muted-foreground">Select up to 4 products and let AI find the best one for you</p>
        </div>

        {showPicker ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {selectedIds.length} of 4 selected
              </p>
              {selectedIds.length >= 2 && (
                <Button onClick={runComparison} className="rounded-full gap-2">
                  <Sparkles className="w-4 h-4" /> Compare with AI
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={cn(
                      'relative p-3 rounded-2xl border-2 transition-all text-left',
                      isSelected ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20' : 'border-border hover:border-blue-300'
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="aspect-square rounded-xl overflow-hidden bg-secondary mb-2">
                      <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs font-medium line-clamp-2">{p.name}</div>
                    <div className="text-sm font-bold mt-1">{formatINR(p.price)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {/* Selected products bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((p) => (
                  <Badge key={p.id} variant="secondary" className="gap-1.5 py-1.5">
                    {p.name.length > 25 ? p.name.slice(0, 25) + '...' : p.name}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleProduct(p.id)} />
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setShowPicker(true)}>
                Add more
              </Button>
            </div>

            {selectedProducts.length >= 2 && (
              <>
                {/* Comparison table */}
                <div className="overflow-x-auto rounded-2xl border border-border mb-6">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="p-4 text-left text-sm font-semibold w-32">Feature</th>
                        {selectedProducts.map((p) => (
                          <th key={p.id} className="p-4 text-left min-w-[180px]">
                            <Link href={`/products/${p.slug}`} className="block">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary mb-2">
                                <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="font-semibold text-sm hover:text-blue-600">{p.name}</div>
                              <div className="text-lg font-bold mt-1">{formatINR(p.price)}</div>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-xs">{p.rating} ({p.reviewCount})</span>
                              </div>
                            </Link>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(selectedProducts[0].specs).map((key, i) => (
                        <tr key={key} className={i % 2 === 0 ? 'bg-secondary/30' : ''}>
                          <td className="p-4 text-sm font-medium">{key}</td>
                          {selectedProducts.map((p) => (
                            <td key={p.id} className="p-4 text-sm text-muted-foreground">
                              {p.specs[key] || '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="bg-secondary/30">
                        <td className="p-4 text-sm font-medium">Price</td>
                        {selectedProducts.map((p) => (
                          <td key={p.id} className="p-4 text-sm font-bold">{formatINR(p.price)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-sm font-medium">Stock</td>
                        {selectedProducts.map((p) => (
                          <td key={p.id} className="p-4 text-sm">
                            <span className={p.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                              {p.stock > 0 ? `${p.stock} available` : 'Out of stock'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* AI Comparison */}
                <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold">AI Comparison Analysis</h3>
                  </div>

                  {loading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="ml-2">Analyzing products...</span>
                    </div>
                  ) : comparison ? (
                    <div className="space-y-4">
                      {/* Pros & Cons */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedProducts.map((p) => (
                          <div key={p.id} className="space-y-2">
                            <div className="text-sm font-medium">{p.name}</div>
                            <div className="space-y-1">
                              {(comparison.pros?.[p.id] || []).map((pro, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-xs">
                                  <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" /> {pro}
                                </div>
                              ))}
                              {(comparison.cons?.[p.id] || []).map((con, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-xs">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" /> {con}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Recommendation */}
                      <div className="flex items-start gap-3">
                        <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm mb-1">AI Recommendation</div>
                          <p className="text-sm text-muted-foreground">{comparison.recommendation}</p>
                          {comparison.bestValueId && (
                            <div className="mt-3">
                              <Button
                                size="sm"
                                className="rounded-full gap-2"
                                onClick={() => {
                                  const best = products.find((p) => p.id === comparison.bestValueId);
                                  if (best) addToCart(best);
                                }}
                              >
                                <ShoppingBag className="w-4 h-4" />
                                Add Best Value to Cart
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={runComparison} className="gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" /> Generate AI Analysis
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
