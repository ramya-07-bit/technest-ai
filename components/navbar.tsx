'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingBag, Heart, User, Menu, X, Sparkles,
  ChevronDown, Mic, Zap, Laptop, Smartphone, Watch, Headphones,
  Gamepad2, Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/components/store-provider';
import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const iconMap: Record<string, React.ElementType> = {
  Laptop, Smartphone, Watch, Headphones, Gamepad2, Camera,
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleVoiceSearch = () => {
    setListening(!listening);
    if (!listening) {
      toast.message('Voice search activated. Speak now...');
      setTimeout(() => setListening(false), 3000);
    }
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled ? 'glass-strong shadow-soft' : 'bg-white/50 backdrop-blur-sm'
        )}
      >
        {/* Announcement bar */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs py-1.5 text-center font-medium">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Get 10% off your first order with code TECHNEST10
          </span>
        </div>

        <nav className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-glow">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                TechNest<span className="text-blue-600"> AI</span>
              </span>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search for laptops, phones, gaming gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-10 rounded-full bg-secondary/60 border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={toggleVoiceSearch}
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors',
                    listening ? 'text-blue-600 animate-pulse' : 'text-muted-foreground hover:text-blue-600'
                  )}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Right icons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Categories dropdown */}
              <div
                className="relative hidden lg:block"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <Button variant="ghost" size="sm" className="gap-1 rounded-full">
                  Categories
                  <ChevronDown className={cn('w-4 h-4 transition-transform', categoriesOpen && 'rotate-180')} />
                </Button>
                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 pt-2 w-64"
                    >
                      <div className="glass-strong rounded-2xl shadow-soft-lg p-2">
                        {categories.map((cat) => {
                          const Icon = iconMap[cat.icon] || Laptop;
                          return (
                            <Link
                              key={cat.name}
                              href={`/products?category=${encodeURIComponent(cat.name)}`}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                <Icon className="w-4.5 h-4.5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{cat.name}</div>
                                <div className="text-xs text-muted-foreground">{cat.description}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button asChild variant="ghost" size="sm" className="gap-1.5 rounded-full hidden sm:flex">
                <Link href="/ai-assistant">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="hidden lg:inline">AI Assistant</span>
                </Link>
              </Button>

              <div className="relative">
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                  <Link href="/wishlist">
                    <Heart className="w-5 h-5" />
                  </Link>
                </Button>
                {wishlist.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs bg-blue-600 text-white pointer-events-none">
                    {wishlist.length}
                  </Badge>
                )}
              </div>

              <div className="relative">
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                  <Link href="/cart">
                    <ShoppingBag className="w-5 h-5" />
                  </Link>
                </Button>
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs bg-blue-600 text-white pointer-events-none">
                    {cartCount}
                  </Badge>
                )}
              </div>

              <Button asChild variant="ghost" size="icon" className="rounded-full">
                <Link href="/profile">
                  <User className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-border"
            >
              <div className="px-4 py-4 space-y-3 bg-white dark:bg-slate-950">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-full"
                    />
                  </div>
                </form>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const Icon = iconMap[cat.icon] || Laptop;
                    return (
                      <Link
                        key={cat.name}
                        href={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-secondary/60 hover:bg-secondary transition-colors"
                      >
                        <Icon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{cat.name}</span>
                      </Link>
                    );
                  })}
                </div>
                <Link href="/ai-assistant" className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-medium text-sm">
                  <Sparkles className="w-4 h-4" /> AI Shopping Assistant
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

