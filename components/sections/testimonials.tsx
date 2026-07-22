'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Arjun Sharma',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648760491-243c5a4d6e2e?w=200&q=80',
    rating: 5,
    text: 'The AI assistant recommended the perfect laptop for coding. Saved me hours of research and I got exactly what I needed within my budget.',
  },
  {
    name: 'Priya Patel',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 5,
    text: 'The comparison feature is a game-changer. I compared 4 laptops side by side with AI-generated pros and cons. Made my decision so easy.',
  },
  {
    name: 'Rohan Mehta',
    role: 'Gaming Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    rating: 5,
    text: 'Built my entire gaming setup using the Smart Budget Builder. Got the best gear within my budget and the recommendations were spot on.',
  },
  {
    name: 'Kavya Reddy',
    role: 'Content Creator',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    rating: 5,
    text: 'The AI review summary saved me so much time. Instead of reading hundreds of reviews, I got a concise summary of what customers actually think.',
  },
];

export function Testimonials() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">What Our Customers Say</h2>
          <p className="text-muted-foreground">Trusted by thousands of tech enthusiasts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card hover:shadow-soft transition-all"
            >
              <Quote className="w-8 h-8 text-blue-200 dark:text-blue-900 mb-3" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{t.text}</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
