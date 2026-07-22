'use client';

import { motion } from 'framer-motion';
import { brands } from '@/lib/data';

export function TopBrands() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Top Brands</h2>
          <p className="text-muted-foreground">Shop from the world's leading tech brands</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-border bg-card hover:shadow-soft hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-xl font-bold text-blue-600">{brand.name[0]}</span>
              </div>
              <div className="text-sm font-medium">{brand.name}</div>
              <div className="text-xs text-muted-foreground">{brand.productCount} products</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
