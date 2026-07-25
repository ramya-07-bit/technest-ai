'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const examples = [
  '"I need a laptop under ₹70000 for coding"',
  '"Best headphones for noise cancellation under ₹15000"',
  '"Gift for my brother under ₹3000"',
  '"Build a gaming setup under ₹1,50,000"',
];

export function AIAssistantSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 p-8 sm:p-12 text-white"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-300/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Shopping</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Your AI Shopping Assistant
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Tell us what you need, and our AI will find the perfect products for you.
                Compare, get recommendations, and discover the best deals — all powered by Gemini AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90 rounded-full gap-2">
                  <Link href="/ai-assistant">
                    <MessageSquareText className="w-5 h-5" />
                    Try AI Assistant
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full gap-2">
                  <Link href="/gift-finder">
                    AI Gift Finder
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {examples.map((ex, i) => (
                <motion.div
                  key={ex}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20"
                >
                  <Sparkles className="w-5 h-5 shrink-0" />
                  <span className="text-sm">{ex}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
