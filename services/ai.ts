// AI service — uses Gemini API when configured, falls back to local heuristics.
// In production, set GEMINI_API_KEY in your environment variables.

import { products, getProductById } from '@/lib/data';
import type { Product, AIRecommendation, ComparisonResult } from '@/types';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

// Local heuristic-based recommendations (fallback when AI is not configured)
export function localRecommend(query: string): { product: Product; reason: string; matchScore: number }[] {
  const q = query.toLowerCase();
  const keywords = q.match(/\b\w+\b/g) || [];

  const scored = products
    .map((p) => {
      let score = 0;
      const productText = `${p.name} ${p.brand} ${p.category} ${p.description} ${p.tags.join(' ')} ${p.features.join(' ')}`.toLowerCase();

      keywords.forEach((kw) => {
        if (productText.includes(kw)) score += 10;
        if (p.tags.some((t) => t.includes(kw))) score += 15;
        if (p.category.toLowerCase().includes(kw)) score += 20;
      });

      // Budget extraction
      const budgetMatch = q.match(/(?:under|below|within)\s+₹?(\d+)/);
      if (budgetMatch) {
        const budget = parseInt(budgetMatch[1]);
        if (p.price <= budget) score += 30;
        else if (p.price <= budget * 1.1) score += 10;
        else score -= 20;
      }

      // Category keywords
      const categoryMap: Record<string, string> = {
        laptop: 'Laptops', mobile: 'Mobiles', phone: 'Mobiles',
        watch: 'Smart Watches', headphone: 'Headphones', earphone: 'Headphones',
        gaming: 'Gaming', camera: 'Cameras',
      };
      Object.entries(categoryMap).forEach(([key, cat]) => {
        if (q.includes(key) && p.category === cat) score += 25;
      });

      // Use-case keywords
      const useCaseMap: Record<string, string[]> = {
        coding: ['coding', 'professional', 'creators'],
        gaming: ['gaming', 'esports'],
        student: ['student', 'budget', 'portable'],
        camera: ['camera', 'flagship'],
        fitness: ['fitness', 'wellness', 'outdoor'],
      };
      Object.entries(useCaseMap).forEach(([key, tags]) => {
        if (q.includes(key) && p.tags.some((t) => tags.includes(t))) score += 20;
      });

      // Boost featured and high-rated
      if (p.isFeatured) score += 5;
      score += p.rating * 2;

      return { product: p, reason: generateReason(p, q), matchScore: Math.min(Math.round(score), 100) };
    })
    .filter((s) => s.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  return scored;
}

function generateReason(p: Product, query: string): string {
  const reasons: string[] = [];
  if (p.rating >= 4.7) reasons.push(`highly rated (${p.rating}★)`);
  if (p.isDeal) reasons.push('currently on deal');
  if (p.isFeatured) reasons.push('a featured product');
  if (p.tags.includes('premium')) reasons.push('premium quality');
  if (p.tags.includes('budget')) reasons.push('great value for money');

  const budgetMatch = query.match(/(?:under|below|within)\s+₹?(\d+)/);
  if (budgetMatch && p.price <= parseInt(budgetMatch[1])) {
    reasons.push('within your budget');
  }

  return reasons.length > 0
    ? `Recommended because it's ${reasons.join(', ')}.`
    : 'A popular choice matching your search.';
}

export async function getAIRecommendations(query: string): Promise<{ product: Product; reason: string; matchScore: number }[]> {
  const local = localRecommend(query);
  const aiText = await callGemini(
    `You are an electronics shopping assistant. Based on this request: "${query}", recommend products from this catalog: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category, tags: p.tags })))}. Return JSON array of { productId, reason, matchScore(0-100) }.`
  );

  if (aiText) {
    try {
      const parsed = JSON.parse(aiText.match(/\[.*\]/s)?.[0] || '[]');
      return parsed
        .map((r: AIRecommendation) => {
          const product = getProductById(r.productId);
          if (!product) return null;
          return { product, reason: r.reason, matchScore: r.matchScore };
        })
        .filter(Boolean)
        .slice(0, 5);
    } catch {}
  }

  return local;
}

export async function getAIComparison(productIds: string[]): Promise<ComparisonResult | null> {
  const selected = productIds.map((id) => getProductById(id)).filter(Boolean) as Product[];
  if (selected.length < 2) return null;

  const aiText = await callGemini(
    `Compare these products and return JSON with pros (object keyed by product id), cons (object keyed by product id), recommendation (string), bestValueId (string): ${JSON.stringify(selected.map(p => ({ id: p.id, name: p.name, price: p.price, specs: p.specs, rating: p.rating })))}`
  );

  if (aiText) {
    try {
      return JSON.parse(aiText.match(/\{.*\}/s)?.[0] || '{}');
    } catch {}
  }

  // Local fallback comparison
  const pros: Record<string, string[]> = {};
  const cons: Record<string, string[]> = {};

  selected.forEach((p) => {
    const pList: string[] = [];
    const cList: string[] = [];
    if (p.rating >= 4.7) pList.push('Excellent rating');
    if (p.isDeal) pList.push('Currently on sale');
    if (p.stock > 20) pList.push('Good availability');
    pList.push(...p.features.slice(0, 3));
    if (p.rating < 4.5) cList.push('Below average rating');
    if (p.stock < 10) cList.push('Low stock');
    const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
    if (discount === 0) cList.push('No current discount');
    if (p.price > 150000) cList.push('Premium pricing');
    pros[p.id] = pList;
    cons[p.id] = cList;
  });

  const bestValue = selected.reduce((best, p) => {
    const valueScore = p.rating / (p.price / 10000);
    const bestScore = best.rating / (best.price / 10000);
    return valueScore > bestScore ? p : best;
  });

  return {
    pros,
    cons,
    recommendation: `Based on the comparison, the ${bestValue.name} offers the best balance of features, rating, and price. It stands out for its ${bestValue.features.slice(0, 2).join(' and ')}.`,
    bestValueId: bestValue.id,
  };
}

export async function getAIReviewSummary(productId: string, reviews: { rating: number; title: string; comment: string }[]): Promise<string> {
  const product = getProductById(productId);
  if (!product) return 'Product not found.';

  const aiText = await callGemini(
    `Summarize these reviews for ${product.name} in 3-4 sentences, highlighting overall sentiment, common praises, and common complaints: ${JSON.stringify(reviews)}`
  );

  if (aiText) return aiText;

  // Local fallback
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const positive = reviews.filter((r) => r.rating >= 4).length;
  const sentiment = avg >= 4.5 ? 'overwhelmingly positive' : avg >= 4 ? 'positive' : 'mixed';

  return `Customers have a ${sentiment} experience with the ${product.name}, with an average rating of ${avg.toFixed(1)} out of 5. ${positive} out of ${reviews.length} reviewers gave it 4 stars or higher. Common praises include ${product.features.slice(0, 2).join(' and ')}. The product is ${product.isDeal ? 'currently available at a discounted price' : 'a popular choice'} in the ${product.category} category.`;
}

export function getGiftRecommendations(budget: number, recipient: string): Product[] {
  const r = recipient.toLowerCase();
  return products
    .filter((p) => p.price <= budget)
    .map((p) => {
      let score = p.rating * 10;
      if (r.includes('brother') && ['Gaming', 'Mobiles', 'Headphones'].includes(p.category)) score += 30;
      if (r.includes('sister') && ['Smart Watches', 'Headphones', 'Cameras'].includes(p.category)) score += 30;
      if (r.includes('father') && ['Smart Watches', 'Laptops'].includes(p.category)) score += 30;
      if (r.includes('mother') && ['Smart Watches', 'Cameras', 'Headphones'].includes(p.category)) score += 30;
      if (r.includes('friend') && p.isFeatured) score += 20;
      if (p.isDeal) score += 15;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((s) => s.p);
}

export function getBudgetBuild(budget: number): { category: string; product: Product }[] {
  const build: { category: string; product: Product }[] = [];
  const allocation = [
    { category: 'Laptops', portion: 0.45 },
    { category: 'Mobiles', portion: 0.30 },
    { category: 'Headphones', portion: 0.12 },
    { category: 'Smart Watches', portion: 0.13 },
  ];

  let remaining = budget;
  for (const alloc of allocation) {
    const target = budget * alloc.portion;
    const best = products
      .filter((p) => p.category === alloc.category && p.price <= Math.max(target, remaining))
      .sort((a, b) => b.rating - a.rating)[0];
    if (best && remaining >= best.price) {
      build.push({ category: alloc.category, product: best });
      remaining -= best.price;
    }
  }

  return build;
}
