'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Share2, Trash2, ArrowRight } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { useStore } from '@/components/store-provider';
import { products, formatINR } from '@/lib/data';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/wishlist`);
    toast.success('Wishlist link copied to clipboard!');
  };

  const moveAllToCart = () => {
    wishlistProducts.forEach((p) => addToCart(p));
    toast.success('All items moved to cart!');
  };

  if (wishlistProducts.length === 0) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-6">Save items you love and come back to them later.</p>
          <Link href="/products"><Button className="rounded-full gap-2">Discover Products <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground text-sm">{wishlistProducts.length} items saved</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full gap-2" onClick={handleShare}><Share2 className="w-4 h-4" /> Share</Button>
            <Button className="rounded-full gap-2" onClick={moveAllToCart}><ShoppingBag className="w-4 h-4" /> Move All to Cart</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 rounded-2xl border border-border bg-card hover:shadow-soft transition-all"
            >
              <Link href={`/products/${product.slug}`} className="shrink-0">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-secondary">
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
              </Link>
              <div className="flex-1">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-sm hover:text-blue-600 line-clamp-2">{product.name}</h3>
                </Link>
                <div className="text-lg font-bold mt-1">{formatINR(product.price)}</div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="rounded-full gap-1.5 h-8" onClick={() => addToCart(product)}>
                    <ShoppingBag className="w-3.5 h-3.5" /> Add
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full h-8 text-red-500" onClick={() => toggleWishlist(product.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
