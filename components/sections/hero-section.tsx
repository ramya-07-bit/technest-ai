'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20 rounded-full blur-3xl" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-cyan-100/50 dark:bg-cyan-950/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/50 dark:bg-blue-950/20 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Powered by Gemini AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance mb-6">
            Smart Electronics Shopping
            <br />
            with <span className="gradient-text">AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            Discover laptops, mobiles, gaming accessories, smart devices and more.
            Let AI find the perfect product for your needs and budget.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/products">
              <Button size="lg" className="rounded-full gap-2 h-12 px-8 text-base shadow-glow group">
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/compare">
              <Button size="lg" variant="outline" className="rounded-full gap-2 h-12 px-8 text-base">
                <BarChart3 className="w-5 h-5" />
                Compare Products
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-8 sm:gap-12 mt-16"
          >
            {[
              { value: '20K+', label: 'Products' },
              { value: '500K+', label: 'Happy Customers' },
              { value: '4.9★', label: 'Avg Rating' },
              { value: '100+', label: 'Top Brands' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero image showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {[
            { src: 'https://images.unsplash.com/photo-1496181133206-56db99963c64?w=400&q=80', label: 'Laptops', icon: Zap },
            { src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', label: 'Mobiles', icon: Sparkles },
            { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', label: 'Audio', icon: Sparkles },
            { src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80', label: 'Gaming', icon: Zap },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img src={item.src} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <item.icon className="w-5 h-5 mb-1" />
                <div className="font-semibold">{item.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
