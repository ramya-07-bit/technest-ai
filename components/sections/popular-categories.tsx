'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Laptop, Smartphone, Watch, Headphones, Gamepad2, Camera, ArrowRight } from 'lucide-react';
import { categories } from '@/lib/data';

const iconMap: Record<string, React.ElementType> = {
  Laptop, Smartphone, Watch, Headphones, Gamepad2, Camera,
};

export function PopularCategories() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Popular Categories</h2>
            <p className="text-muted-foreground">Explore our most shopped categories</p>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Laptop;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group block relative aspect-square rounded-2xl overflow-hidden border border-border hover:shadow-soft-lg transition-all duration-300"
                >
                  <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-sm">{cat.name}</div>
                    <div className="text-xs text-white/70 line-clamp-1">{cat.description}</div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
