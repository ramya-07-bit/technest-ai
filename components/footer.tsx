'use client';

import Link from 'next/link';
import { Zap, Twitter, Instagram, Youtube, Linkedin, Github } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const footerLinks = {
  Shop: [
    { label: 'Laptops', href: '/products?category=Laptops' },
    { label: 'Mobiles', href: '/products?category=Mobiles' },
    { label: 'Smart Watches', href: '/products?category=Smart Watches' },
    { label: 'Headphones', href: '/products?category=Headphones' },
    { label: 'Gaming', href: '/products?category=Gaming' },
    { label: 'Cameras', href: '/products?category=Cameras' },
  ],
  'AI Features': [
    { label: 'AI Shopping Assistant', href: '/ai-assistant' },
    { label: 'AI Product Comparison', href: '/compare' },
    { label: 'AI Gift Finder', href: '/gift-finder' },
    { label: 'Smart Budget Builder', href: '/budget-builder' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Track Order', href: '/orders' },
    { label: 'Returns', href: '#' },
    { label: 'Warranty', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 mt-20">
      {/* Newsletter */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-1">Stay in the loop</h3>
              <p className="text-white/80">Get exclusive deals and early access to new products.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2 max-w-md">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white/40"
              />
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-white/90 shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-bold text-lg">TechNest<span className="text-blue-600"> AI</span></span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Smart electronics shopping powered by AI. Find the perfect product for your needs.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 TechNest AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-blue-600 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
