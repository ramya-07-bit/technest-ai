import { products } from '@/lib/data';
import type { Product } from '@/types';

// ─── Form option types ───────────────────────────────────────────────────────

export type DeviceType = 'Laptop' | 'Smartphone' | 'Headphones' | 'Camera' | 'Smartwatch' | 'Gaming';
export type BudgetRange = 'under-30k' | '30k-60k' | '60k-1lakh' | 'above-1lakh';
export type PrimaryUse = 'Coding' | 'Gaming' | 'Office' | 'Student' | 'Editing' | 'Business';
export type PreferredBrand = 'Apple' | 'Samsung' | 'Dell' | 'ASUS' | 'HP' | 'Sony' | 'No Preference';
export type PerformancePriority = 'Performance' | 'Battery Life' | 'Portability' | 'Camera' | 'Display' | 'Value';

export interface DeviceFinderAnswers {
  budget: BudgetRange | null;
  deviceType: DeviceType | null;
  primaryUse: PrimaryUse | null;
  brand: PreferredBrand | null;
  performance: PerformancePriority | null;
}

// Non-nullable variant — used after all fields are validated
export interface CompletedAnswers {
  budget: BudgetRange;
  deviceType: DeviceType;
  primaryUse: PrimaryUse;
  brand: PreferredBrand;
  performance: PerformancePriority;
}

export interface DeviceFinderResult {
  product: Product;
  matchScore: number;
  reason: string;
}

// ─── Mappings ───────────────────────────────────────────────────────────────

const BUDGET_MAP: Record<BudgetRange, [number, number]> = {
  'under-30k': [0, 30000],
  '30k-60k': [30000, 60000],
  '60k-1lakh': [60000, 100000],
  'above-1lakh': [100000, Infinity],
};

const CATEGORY_MAP: Record<DeviceType, string> = {
  Laptop: 'Laptops',
  Smartphone: 'Mobiles',
  Headphones: 'Headphones',
  Camera: 'Cameras',
  Smartwatch: 'Smart Watches',
  Gaming: 'Gaming',
};

const USE_TAG_MAP: Record<PrimaryUse, string[]> = {
  Coding: ['coding', 'professional', 'creators'],
  Gaming: ['gaming', 'esports'],
  Office: ['professional', 'business', 'portable'],
  Student: ['student', 'budget', 'portable'],
  Editing: ['creators', 'professional', 'camera'],
  Business: ['professional', 'business', 'premium'],
};

const PERFORMANCE_KEYWORDS: Record<PerformancePriority, string[]> = {
  Performance: ['rtx', 'gpu', 'a17', 'm3', 'ryzen 9', 'snapdragon 8', 'pro', '165hz', '120hz'],
  'Battery Life': ['battery', 'hours', 'mah', '72hr', '18hr', '15hr', '30hr'],
  Portability: ['weight', 'kg', 'lightweight', 'portable', 'compact', 'magnesium', 'thin'],
  Camera: ['camera', 'mp', '48mp', '50mp', '200mp', 'lens', 'ibis', 'sensor'],
  Display: ['display', 'oled', 'retina', 'amoled', '4k', '3.5k', 'xdr', 'hdr', 'nits'],
  Value: ['budget', 'deal', 'charger', 'fast', 'warranty', 'updates'],
};

// ─── Scoring ─────────────────────────────────────────────────────────────────

function scoreProduct(
  product: Product,
  answers: CompletedAnswers,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Budget fit (0-30)
  const [minB, maxB] = BUDGET_MAP[answers.budget];
  if (product.price >= minB && product.price <= maxB) {
    score += 30;
    reasons.push('fits your budget');
  } else if (product.price <= maxB * 1.15) {
    score += 12;
  }

  // Device type / category (0-25)
  if (product.category === CATEGORY_MAP[answers.deviceType]) {
    score += 25;
  }

  // Primary use tags (0-20)
  const useTags = USE_TAG_MAP[answers.primaryUse];
  let useHits = 0;
  useTags.forEach((tag) => {
    if (product.tags.includes(tag)) useHits += 1;
  });
  score += useHits * 7;
  if (useHits > 0) reasons.push(`great for ${answers.primaryUse.toLowerCase()}`);

  // Brand preference (0-15)
  if (answers.brand !== 'No Preference' && product.brand === answers.brand) {
    score += 15;
    reasons.push(`from ${product.brand}`);
  } else if (answers.brand === 'No Preference') {
    score += 3;
  }

  // Performance priority (0-20)
  const keywords = PERFORMANCE_KEYWORDS[answers.performance];
  const specText = Object.values(product.specs).join(' ').toLowerCase();
  const featureText = product.features.join(' ').toLowerCase();
  const combined = `${specText} ${featureText} ${product.tags.join(' ')}`;
  let perfHits = 0;
  keywords.forEach((kw) => {
    if (combined.includes(kw)) perfHits += 1;
  });
  score += Math.min(perfHits * 5, 20);
  if (perfHits > 0) reasons.push(`strong on ${answers.performance.toLowerCase()}`);

  // Rating boost (0-10)
  score += Math.round((product.rating - 4) * 20);

  // Featured / deal bonus
  if (product.isFeatured) score += 4;
  if (product.isDeal) score += 3;

  return { score: Math.max(0, score), reasons };
}

function buildReason(product: Product, answers: CompletedAnswers, reasons: string[]): string {
  const reasonStr = reasons.length > 0 ? reasons.join(', ') : 'a popular, well-rated choice';
  return `The ${product.name} ${reasonStr}. With a ${product.rating}★ rating from ${product.reviewCount.toLocaleString('en-IN')} reviews, it's a top pick for ${answers.primaryUse.toLowerCase()} in the ${product.category.toLowerCase()} category.`;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function getDeviceFinderRecommendations(
  answers: DeviceFinderAnswers,
  limit = 5,
): DeviceFinderResult[] {
  if (!answers.budget || !answers.deviceType || !answers.primaryUse || !answers.brand || !answers.performance) {
    return [];
  }

  const safe: CompletedAnswers = {
    budget: answers.budget!,
    deviceType: answers.deviceType!,
    primaryUse: answers.primaryUse!,
    brand: answers.brand!,
    performance: answers.performance!,
  };
  const targetCategory = CATEGORY_MAP[safe.deviceType];
  const [minB, maxB] = BUDGET_MAP[safe.budget];

  // Prefer products in the right category and budget
  let pool = products.filter(
    (p) => p.category === targetCategory && p.price >= minB && p.price <= maxB,
  );

  // Fallback: right category, any budget
  if (pool.length < 3) {
    pool = products.filter((p) => p.category === targetCategory);
  }

  // Fallback: budget match, any category
  if (pool.length < 3) {
    pool = products.filter((p) => p.price >= minB && p.price <= maxB);
  }

  // Final fallback: everything
  if (pool.length < 3) {
    pool = [...products];
  }

  const scored = pool
    .map((product) => {
      const { score, reasons } = scoreProduct(product, safe);
      return { product, score, reasons };
    })
    .sort((a, b) => b.score - a.score);

  const maxScore = scored[0]?.score || 1;

  return scored.slice(0, limit).map(({ product, score, reasons }) => {
    const matchScore = Math.min(Math.max(Math.round((score / maxScore) * 100), 70), 99);
    return {
      product,
      matchScore,
      reason: buildReason(product, safe, reasons),
    };
  });
}
