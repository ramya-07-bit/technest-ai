'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/components/store-provider';
import { formatINR } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, index = 0, layout = 'grid' }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wished = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group flex gap-4 p-4 rounded-2xl border border-border bg-card hover:shadow-soft-lg transition-all duration-300"
      >
        <Link href={`/products/${product.slug}`} className="relative shrink-0">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-secondary">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </Link>
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Badge variant="secondary" className="mb-1 text-xs">{product.brand}</Badge>
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-semibold text-base hover:text-blue-600 transition-colors">{product.name}</h3>
              </Link>
            </div>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={cn('p-2 rounded-full hover:bg-secondary transition-colors', wished && 'text-red-500')}
            >
              <Heart className={cn('w-4.5 h-4.5', wished && 'fill-current')} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between mt-auto pt-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{formatINR(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
              )}
            </div>
            <Button size="sm" onClick={() => addToCart(product)} className="rounded-full gap-1.5">
              <ShoppingBag className="w-4 h-4" /> Add
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative"
    >
      <div className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-soft-lg transition-all duration-300">
        {/* Image */}
        <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-secondary">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <Badge className="bg-red-500 hover:bg-red-500 text-white">-{discount}%</Badge>
            )}
            {product.isDeal && (
              <Badge className="bg-amber-500 hover:bg-amber-500 text-white gap-1">
                <Zap className="w-3 h-3" fill="white" /> Deal
              </Badge>
            )}
          </div>
          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
              className={cn(
                'w-9 h-9 rounded-full glass-strong flex items-center justify-center hover:bg-white transition-colors',
                wished && 'text-red-500'
              )}
            >
              <Heart className={cn('w-4.5 h-4.5', wished && 'fill-current')} />
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="w-9 h-9 rounded-full glass-strong flex items-center justify-center hover:bg-white transition-colors"
            >
              <Eye className="w-4.5 h-4.5" />
            </Link>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <Badge variant="secondary" className="text-xs">{product.brand}</Badge>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">{product.rating}</span>
            </div>
          </div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-blue-600 transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => addToCart(product)}
            className="w-full mt-3 rounded-full gap-1.5 group-hover:shadow-glow"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
