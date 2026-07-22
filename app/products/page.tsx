'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutGrid, List, SlidersHorizontal, X, Star, Check } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { products, categories, brands } from '@/lib/data';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('q');
    if (cat) setSelectedCategory(cat);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    switch (sort) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()); break;
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [selectedCategory, searchQuery, priceRange, selectedBrands, minRating, inStockOnly, sort]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
    setPriceRange([0, 300000]);
    setSelectedCategory(null);
    setSearchQuery('');
    router.push('/products');
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => { setSelectedCategory(null); router.push('/products'); }}
            className={cn(
              'text-sm px-3 py-1.5 rounded-full transition-colors',
              !selectedCategory ? 'bg-blue-600 text-white' : 'bg-secondary hover:bg-secondary/80'
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => { setSelectedCategory(cat.name); router.push(`/products?category=${encodeURIComponent(cat.name)}`); }}
              className={cn(
                'block text-sm px-3 py-1.5 rounded-full transition-colors',
                selectedCategory === cat.name ? 'bg-blue-600 text-white' : 'bg-secondary hover:bg-secondary/80'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
          min={0}
          max={300000}
          step={5000}
          className="my-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
          <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Brands</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand.name} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.name}`}
                checked={selectedBrands.includes(brand.name)}
                onCheckedChange={() => toggleBrand(brand.name)}
              />
              <Label htmlFor={`brand-${brand.name}`} className="text-sm cursor-pointer">
                {brand.name} <span className="text-muted-foreground">({brand.productCount})</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={cn(
                'flex items-center gap-2 text-sm px-3 py-1.5 rounded-full transition-colors w-full',
                minRating === r ? 'bg-blue-600 text-white' : 'bg-secondary hover:bg-secondary/80'
              )}
            >
              {r === 0 ? 'All Ratings' : (
                <>
                  <Star className="w-3.5 h-3.5 fill-current" /> {r}+ Stars
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(v) => setInStockOnly(v === true)}
          />
          <Label htmlFor="in-stock" className="text-sm cursor-pointer flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> In Stock Only
          </Label>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            {selectedCategory || 'All Products'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {filtered.length} products found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <ScrollArea className="h-[calc(100vh-7rem)]">
                <FiltersContent />
              </ScrollArea>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-4 p-3 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-2">
                {/* Mobile filter */}
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden gap-2 rounded-full">
                      <SlidersHorizontal className="w-4 h-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="text-sm border border-border rounded-full px-3 py-2 bg-card focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-full bg-secondary">
                <button
                  onClick={() => setView('grid')}
                  className={cn('p-1.5 rounded-full transition-colors', view === 'grid' ? 'bg-white shadow-soft dark:bg-slate-800' : '')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={cn('p-1.5 rounded-full transition-colors', view === 'list' ? 'bg-white shadow-soft dark:bg-slate-800' : '')}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active filters */}
            {(selectedBrands.length > 0 || minRating > 0 || inStockOnly || selectedCategory) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => { setSelectedCategory(null); router.push('/products'); }} />
                  </Badge>
                )}
                {selectedBrands.map((b) => (
                  <Badge key={b} variant="secondary" className="gap-1">
                    {b}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleBrand(b)} />
                  </Badge>
                ))}
                {minRating > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    {minRating}+ Stars
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
                  </Badge>
                )}
                {inStockOnly && (
                  <Badge variant="secondary" className="gap-1">
                    In Stock
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
                  </Badge>
                )}
              </div>
            )}

            {/* Products */}
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} layout="list" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
