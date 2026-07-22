'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, User, Bot, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/components/store-provider';
import { formatINR } from '@/lib/data';
import { getAIRecommendations, localRecommend } from '@/services/ai';
import type { Product } from '@/types';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  products?: { product: Product; reason: string; matchScore: number }[];
}

const suggestions = [
  'I need a laptop under ₹70000 for coding',
  'Best noise-canceling headphones under ₹15000',
  'Gift for my brother under ₹3000',
  'Best camera for content creators',
];

export default function AIAssistantPage() {
  const { addToCart } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Shopping Assistant. Tell me what you're looking for and I'll find the perfect products for you. Try asking about laptops, phones, gaming gear, or anything tech-related!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const recommendations = await getAIRecommendations(text);

    const assistantMsg: Message = {
      role: 'assistant',
      content: recommendations.length > 0
        ? `Based on your request, I found ${recommendations.length} products that match your needs. Here are my top recommendations:`
        : "I couldn't find any products matching your request. Could you try rephrasing or adjusting your budget?",
      products: recommendations,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Powered by Gemini AI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">AI Shopping Assistant</h1>
          <p className="text-muted-foreground">Tell us what you need, and we'll find the perfect products</p>
        </div>

        {/* Chat */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden flex flex-col h-[600px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-600 to-cyan-500'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4.5 h-4.5 text-white" /> : <Bot className="w-4.5 h-4.5 text-white" />}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block px-4 py-3 rounded-2xl text-sm ${
                      msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-secondary'
                    }`}>
                      {msg.content}
                    </div>
                    {/* Product recommendations */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.products.map(({ product, reason, matchScore }) => (
                          <div key={product.id} className="flex gap-3 p-3 rounded-2xl border border-border bg-card text-left">
                            <Link href={`/products/${product.slug}`} className="shrink-0">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary">
                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                              </div>
                            </Link>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <Link href={`/products/${product.slug}`} className="font-medium text-sm hover:text-blue-600 line-clamp-1">{product.name}</Link>
                                <Badge className="shrink-0 gap-1 text-xs" variant={matchScore >= 70 ? 'default' : 'secondary'}>
                                  <Star className="w-3 h-3" /> {matchScore}% match
                                </Badge>
                              </div>
                              <div className="text-sm font-bold mt-0.5">{formatINR(product.price)}</div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{reason}</p>
                              <Button size="sm" className="mt-2 h-7 rounded-full text-xs gap-1" onClick={() => addToCart(product)}>
                                <ShoppingBag className="w-3 h-3" /> Add to Cart
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <Bot className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-secondary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about tech products..."
                className="rounded-full"
                disabled={loading}
              />
              <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={loading || !input.trim()}>
                <Send className="w-4.5 h-4.5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
