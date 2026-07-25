'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Heart, ShoppingBag, Zap, Star, Truck, Shield, RotateCcw,
  Check, ChevronRight, Plus, Minus, GitCompare, Sparkles, Eye,
} from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/product-card';
import { useStore } from '@/components/store-provider';
import { getProductBySlug, getRelatedProducts, getReviewsForProduct, formatINR, products } from '@/lib/data';
import { getAIReviewSummary } from '@/services/ai';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const product = getProductBySlug(params.slug as string);
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [reviewSummary, setReviewSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      setSelectedImage(0);
      setQuantity(1);
      setReviewSummary(null);
    }
  }, [product, addRecentlyViewed]);

  if (!product) {
    return (
      <PageShell>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <Button asChild><Link href="/products">Back to Products</Link></Button>
        </div>
      </PageShell>
    );
  }

  const related = getRelatedProducts(product);
  const reviews = getReviewsForProduct(product.id);
  const wished = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const frequentlyBought = products
    .filter((p) => p.category !== product.category && p.price < product.price * 0.3)
    .slice(0, 2);

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const loadReviewSummary = async () => {
    if (reviewSummary) return;
    setLoadingSummary(true);
    const summary = await getAIReviewSummary(product.id, reviews.length > 0 ? reviews : [{ rating: product.rating, title: 'Good', comment: product.description }]);
    setReviewSummary(summary);
    setLoadingSummary(false);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleCompare = () => {
    const compareItems = JSON.parse(sessionStorage.getItem('compare-items') || '[]');
    if (!compareItems.includes(product.id)) {
      compareItems.push(product.id);
      sessionStorage.setItem('compare-items', JSON.stringify(compareItems.slice(-4)));
    }
    router.push('/compare');
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600">{product.category}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-secondary cursor-zoom-in"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleZoom}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={zoom ? { transform: `scale(2)`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-500 text-white">-{discount}% OFF</Badge>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
                      selectedImage === i ? 'border-blue-600 shadow-soft' : 'border-border hover:border-blue-300'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: Truck, label: 'Free Delivery' },
                { icon: Shield, label: '2 Year Warranty' },
                { icon: RotateCcw, label: '7 Day Returns' },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-1 p-3 rounded-xl border border-border bg-card">
                  <t.icon className="w-5 h-5 text-blue-600" />
                  <span className="text-xs text-center text-muted-foreground">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <Badge variant="secondary" className="mb-2">{product.brand}</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('w-4 h-4', i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')} />
                  ))}
                  <span className="text-sm font-medium ml-1">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">{product.reviewCount} reviews</span>
                <span className={cn('text-sm', product.stock > 0 ? 'text-green-600' : 'text-red-500')}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatINR(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
              )}
              {discount > 0 && (
                <Badge className="bg-green-500 hover:bg-green-500 text-white">Save {formatINR(product.originalPrice! - product.price)}</Badge>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {product.features.map((f) => (
                <Badge key={f} variant="secondary" className="gap-1 py-1.5">
                  <Check className="w-3 h-3 text-green-600" /> {f}
                </Badge>
              ))}
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-1 p-1 rounded-full border border-border">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1.5 rounded-full hover:bg-secondary">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-1.5 rounded-full hover:bg-secondary">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="flex-1 rounded-full gap-2 shadow-glow" onClick={() => addToCart(product, quantity)}>
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="flex-1 rounded-full gap-2 border-blue-200 text-blue-600 hover:bg-blue-50" onClick={handleBuyNow}>
                  <Zap className="w-5 h-5" /> Buy Now
                </Button>
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 rounded-full gap-2" onClick={() => toggleWishlist(product.id)}>
                  <Heart className={cn('w-5 h-5', wished && 'fill-red-500 text-red-500')} />
                  {wished ? 'Wishlisted' : 'Wishlist'}
                </Button>
                <Button variant="ghost" className="flex-1 rounded-full gap-2" onClick={handleCompare}>
                  <GitCompare className="w-5 h-5" /> Compare
                </Button>
              </div>
            </div>

            <Separator />

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(product.specs).slice(0, 6).map(([key, val]) => (
                <div key={key} className="flex flex-col p-3 rounded-xl bg-secondary/50">
                  <span className="text-xs text-muted-foreground">{key}</span>
                  <span className="text-sm font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Specs, Reviews, AI Summary */}
        <div className="mt-12">
          <Tabs defaultValue="specs">
            <TabsList className="w-full justify-start h-auto p-1.5 rounded-full bg-secondary mb-6 flex-wrap">
              <TabsTrigger value="specs" className="rounded-full">Specifications</TabsTrigger>
              <TabsTrigger value="description" className="rounded-full">Description</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-full">Reviews ({reviews.length || product.reviewCount})</TabsTrigger>
              <TabsTrigger value="ai-summary" className="rounded-full gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Review Summary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specs">
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], i) => (
                      <tr key={key} className={i % 2 === 0 ? 'bg-secondary/30' : ''}>
                        <td className="px-4 py-3 font-medium text-sm w-1/3">{key}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="description">
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                <ul className="mt-4 space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-2xl border border-border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center font-semibold text-blue-600">
                            {review.author[0]}
                          </div>
                          <div>
                            <div className="font-medium text-sm flex items-center gap-2">
                              {review.author}
                              {review.verified && <Badge variant="secondary" className="text-xs gap-1"><Check className="w-3 h-3" /> Verified</Badge>}
                            </div>
                            <div className="text-xs text-muted-foreground">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn('w-3.5 h-3.5', i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')} />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{review.title}</h4>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      <div className="text-xs text-muted-foreground mt-2">{review.helpful} found this helpful</div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No detailed reviews yet. Be the first to review!</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ai-summary">
              <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold">AI-Generated Review Summary</h3>
                </div>
                {reviewSummary ? (
                  <p className="text-sm leading-relaxed">{reviewSummary}</p>
                ) : (
                  <Button variant="outline" onClick={loadReviewSummary} disabled={loadingSummary} className="gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    {loadingSummary ? 'Generating Summary...' : 'Generate AI Summary'}
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Frequently Bought Together */}
        {frequentlyBought.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Frequently Bought Together</h2>
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-border">
                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  {frequentlyBought.map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                      <Link href={`/products/${p.slug}`} className="w-24 h-24 rounded-xl overflow-hidden border border-border hover:shadow-soft transition-all">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="sm:ml-auto text-center sm:text-right">
                  <div className="text-sm text-muted-foreground mb-1">Total Price:</div>
                  <div className="text-2xl font-bold mb-2">
                    {formatINR(product.price + frequentlyBought.reduce((s, p) => s + p.price, 0))}
                  </div>
                  <Button className="rounded-full gap-2" onClick={() => {
                    addToCart(product);
                    frequentlyBought.forEach((p) => addToCart(p));
                  }}>
                    <ShoppingBag className="w-4 h-4" /> Add All to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
