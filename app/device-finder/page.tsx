'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanSearch, Sparkles, ArrowLeft, ArrowRight, RotateCcw,
  Star, ShoppingBag, Check, ChevronRight, Zap,
  Laptop, Smartphone, Headphones, Camera, Watch, Gamepad2,
  Wallet, Code2, Briefcase, GraduationCap,
  Film, Building2, Apple, Cpu, Server, Monitor, Battery, Tag,
} from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/components/store-provider';
import { formatINR } from '@/lib/data';
import {
  getDeviceFinderRecommendations,
  type DeviceFinderAnswers,
  type DeviceFinderResult,
  type DeviceType,
  type BudgetRange,
  type PrimaryUse,
  type PreferredBrand,
  type PerformancePriority,
} from '@/lib/device-finder';
import { cn } from '@/lib/utils';

// ─── Option metadata ────────────────────────────────────────────────────────

interface OptionItem<T extends string> {
  value: T;
  label: string;
  sublabel?: string;
  icon: React.ElementType;
  gradient: string;
}

const DEVICE_OPTIONS: OptionItem<DeviceType>[] = [
  { value: 'Laptop',      label: 'Laptop',      sublabel: 'MacBooks & notebooks', icon: Laptop,      gradient: 'from-blue-500 to-blue-600' },
  { value: 'Smartphone',  label: 'Smartphone',  sublabel: 'iOS & Android',        icon: Smartphone,  gradient: 'from-cyan-500 to-blue-500' },
  { value: 'Headphones',  label: 'Headphones',  sublabel: 'Wireless & ANC',       icon: Headphones,  gradient: 'from-violet-500 to-purple-600' },
  { value: 'Camera',      label: 'Camera',      sublabel: 'Mirrorless & action', icon: Camera,      gradient: 'from-amber-500 to-orange-500' },
  { value: 'Smartwatch',  label: 'Smartwatch',  sublabel: 'Wearables',            icon: Watch,       gradient: 'from-rose-500 to-pink-500' },
  { value: 'Gaming',      label: 'Gaming',      sublabel: 'Consoles & gear',      icon: Gamepad2,    gradient: 'from-emerald-500 to-teal-600' },
];

const BUDGET_OPTIONS: OptionItem<BudgetRange>[] = [
  { value: 'under-30k',    label: 'Under ₹30,000',        sublabel: 'Budget-friendly',   icon: Wallet, gradient: 'from-green-500 to-emerald-600' },
  { value: '30k-60k',      label: '₹30,000 – ₹60,000',   sublabel: 'Great value',       icon: Wallet, gradient: 'from-blue-500 to-cyan-500' },
  { value: '60k-1lakh',    label: '₹60,000 – ₹1,00,000', sublabel: 'Premium tier',      icon: Wallet, gradient: 'from-violet-500 to-blue-500' },
  { value: 'above-1lakh',  label: 'Above ₹1,00,000',      sublabel: 'Flagship grade',    icon: Wallet, gradient: 'from-amber-500 to-rose-500' },
];

const USE_OPTIONS: OptionItem<PrimaryUse>[] = [
  { value: 'Coding',   label: 'Coding',    sublabel: 'Dev & engineering', icon: Code2,         gradient: 'from-blue-500 to-cyan-500' },
  { value: 'Gaming',   label: 'Gaming',    sublabel: 'High FPS & GPU',   icon: Gamepad2,       gradient: 'from-rose-500 to-orange-500' },
  { value: 'Office',   label: 'Office',    sublabel: 'Productivity',     icon: Briefcase,     gradient: 'from-slate-500 to-slate-600' },
  { value: 'Student',  label: 'Student',   sublabel: 'Study & research', icon: GraduationCap, gradient: 'from-green-500 to-teal-500' },
  { value: 'Editing',  label: 'Editing',   sublabel: 'Photo & video',    icon: Film,          gradient: 'from-violet-500 to-pink-500' },
  { value: 'Business', label: 'Business',  sublabel: 'Enterprise & pro',  icon: Building2,    gradient: 'from-blue-600 to-indigo-600' },
];

const BRAND_OPTIONS: OptionItem<PreferredBrand>[] = [
  { value: 'Apple',          label: 'Apple',         sublabel: 'iOS / macOS',     icon: Apple,    gradient: 'from-gray-600 to-gray-800' },
  { value: 'Samsung',        label: 'Samsung',       sublabel: 'Android & more',  icon: Cpu,      gradient: 'from-blue-600 to-blue-700' },
  { value: 'Dell',           label: 'Dell',          sublabel: 'Windows laptops', icon: Monitor,  gradient: 'from-sky-600 to-blue-600' },
  { value: 'ASUS',           label: 'ASUS',          sublabel: 'Gaming & pro',    icon: Server,   gradient: 'from-blue-500 to-cyan-500' },
  { value: 'HP',             label: 'HP',            sublabel: 'Business & home', icon: Monitor,  gradient: 'from-blue-700 to-indigo-700' },
  { value: 'Sony',           label: 'Sony',          sublabel: 'Audio & imaging', icon: Headphones, gradient: 'from-slate-600 to-slate-800' },
  { value: 'No Preference',  label: 'No Preference', sublabel: 'Best overall',    icon: Tag,      gradient: 'from-green-500 to-emerald-600' },
];

const PERFORMANCE_OPTIONS: OptionItem<PerformancePriority>[] = [
  { value: 'Performance',    label: 'Performance',     sublabel: 'Max power',       icon: Zap,          gradient: 'from-rose-500 to-orange-500' },
  { value: 'Battery Life',   label: 'Battery Life',   sublabel: 'All-day usage',   icon: Battery,      gradient: 'from-green-500 to-emerald-600' },
  { value: 'Portability',    label: 'Portability',    sublabel: 'Light & compact', icon: Briefcase,    gradient: 'from-blue-500 to-cyan-500' },
  { value: 'Camera',         label: 'Camera',         sublabel: 'Best imaging',    icon: Camera,       gradient: 'from-violet-500 to-purple-600' },
  { value: 'Display',        label: 'Display',        sublabel: 'Screen quality',  icon: Monitor,      gradient: 'from-amber-500 to-orange-500' },
  { value: 'Value',          label: 'Value',          sublabel: 'Best bang for buck', icon: Tag,        gradient: 'from-teal-500 to-green-500' },
];

// ─── Step definitions ───────────────────────────────────────────────────────

const TOTAL_STEPS = 5;

const STEP_META = [
  { step: 1, title: 'Choose Device',       description: 'What type of device are you looking for?' },
  { step: 2, title: 'Set Your Budget',      description: 'What is your budget range?' },
  { step: 3, title: 'Primary Use',          description: 'How will you mainly use this device?' },
  { step: 4, title: 'Preferred Brand',      description: 'Do you have a brand preference?' },
  { step: 5, title: 'Performance Priority', description: 'What matters most to you?' },
];

const EMPTY_ANSWERS: DeviceFinderAnswers = {
  budget: null,
  deviceType: null,
  primaryUse: null,
  brand: null,
  performance: null,
};

// ─── Slide animation variants ────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: () => ({ opacity: 1, x: 0 }),
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -48 : 48 }),
};
const slideTransition = { duration: 0.28, ease: [0.4, 0, 0.2, 1] as const };

// ─── Reusable option grid ────────────────────────────────────────────────────

interface OptionGridProps<T extends string> {
  options: OptionItem<T>[];
  value: T | null;
  onSelect: (v: T) => void;
  cols?: 2 | 3 | 4;
}

function OptionGrid<T extends string>({ options, value, onSelect, cols = 3 }: OptionGridProps<T>) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[cols];

  return (
    <div className={cn('grid gap-3', colClass)}>
      {options.map((opt, i) => {
        const selected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: i * 0.04 }}
            onClick={() => onSelect(opt.value)}
            type="button"
            className={cn(
              'group relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              selected
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 shadow-glow'
                : 'border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-soft',
            )}
          >
            <div
              className={cn(
                'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br text-white transition-transform duration-200 group-hover:scale-110',
                opt.gradient,
                selected && 'scale-110',
              )}
            >
              <opt.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className={cn('text-sm font-semibold leading-tight', selected && 'text-blue-600')}>
                {opt.label}
              </div>
              {opt.sublabel && (
                <div className="text-xs text-muted-foreground mt-0.5 truncate">{opt.sublabel}</div>
              )}
            </div>
            <AnimatePresence>
              {selected && (
                <motion.div
                  key="tick"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Progress bar ────────────────────────────────────────────────────────────

function StepProgress({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const pct = Math.round(((currentStep - 1) / totalSteps) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const done = stepNum < currentStep;
          const active = stepNum === currentStep;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all duration-300',
                  done && 'bg-blue-600 text-white',
                  active && 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900',
                  !done && !active && 'bg-secondary text-muted-foreground',
                )}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : stepNum}
              </div>
              {i < totalSteps - 1 && (
                <div className="flex-1 h-0.5 mx-1.5 rounded-full overflow-hidden bg-border">
                  <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: done ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>
      <div className="text-right text-xs text-muted-foreground mt-1">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}

// ─── Validation ─────────────────────────────────────────────────────────────

function isStepValid(step: number, answers: DeviceFinderAnswers): boolean {
  if (step === 1) return answers.deviceType !== null;
  if (step === 2) return answers.budget !== null;
  if (step === 3) return answers.primaryUse !== null;
  if (step === 4) return answers.brand !== null;
  if (step === 5) return answers.performance !== null;
  return false;
}

// ─── Result card ──────────────────────────────────────────────────────────────

interface ResultCardProps {
  result: DeviceFinderResult;
  index: number;
}

function ResultCard({ result, index }: ResultCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const { product, matchScore, reason } = result;
  const wished = isInWishlist(product.id);

  const scoreColour =
    matchScore >= 90 ? 'text-green-600' :
    matchScore >= 80 ? 'text-blue-600'  :
    'text-amber-600';

  const scoreBorder =
    matchScore >= 90 ? 'border-green-500' :
    matchScore >= 80 ? 'border-blue-500'  :
    'border-amber-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-soft-lg transition-all duration-300 flex flex-col"
    >
      {/* Image with score badge */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-secondary">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isDeal && (
            <Badge className="bg-amber-500 hover:bg-amber-500 text-white gap-1">
              <Zap className="w-3 h-3" fill="white" /> Deal
            </Badge>
          )}
        </div>
        <div className={cn(
          'absolute top-3 right-3 w-14 h-14 rounded-full border-4 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm',
          scoreBorder,
        )}>
          <span className={cn('text-base font-bold leading-none', scoreColour)}>{matchScore}</span>
          <span className="text-[8px] text-muted-foreground font-medium leading-none mt-0.5">MATCH</span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <Badge variant="secondary" className="text-xs">{product.brand}</Badge>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-blue-600 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold">{formatINR(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
          )}
        </div>

        {/* Key specs */}
        <div className="grid grid-cols-2 gap-1.5 mt-3">
          {Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
            <div key={key} className="flex flex-col px-2 py-1.5 rounded-lg bg-secondary/50">
              <span className="text-[10px] text-muted-foreground leading-none">{key}</span>
              <span className="text-xs font-medium mt-0.5 leading-snug truncate">{val}</span>
            </div>
          ))}
        </div>

        {/* Why recommended */}
        <div className="mt-3 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-xs font-semibold">Why this matches</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3 pt-1 mt-auto">
          <Button
            size="sm"
            onClick={() => addToCart(product)}
            className="flex-1 rounded-full gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Add
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleWishlist(product.id)}
            className={cn('rounded-full', wished && 'text-red-500 border-red-200')}
          >
            <Check className={cn('w-3.5 h-3.5', wished && 'fill-current')} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────

function ResultSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="aspect-square bg-secondary animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-secondary rounded animate-pulse w-3/4" />
            <div className="h-4 bg-secondary rounded animate-pulse w-1/2" />
            <div className="h-16 bg-secondary rounded-lg animate-pulse" />
            <div className="h-8 bg-secondary rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function DeviceFinderPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<DeviceFinderAnswers>(EMPTY_ANSWERS);
  const [phase, setPhase] = useState<'quiz' | 'loading' | 'results'>('quiz');
  const [results, setResults] = useState<DeviceFinderResult[]>([]);

  const goNext = useCallback(() => {
    if (!isStepValid(step, answers)) return;
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      setPhase('loading');
      setTimeout(() => {
        setResults(getDeviceFinderRecommendations(answers, 6));
        setPhase('results');
      }, 1400);
    }
  }, [step, answers]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const startAgain = useCallback(() => {
    setAnswers(EMPTY_ANSWERS);
    setResults([]);
    setDirection(-1);
    setStep(1);
    setPhase('quiz');
  }, []);

  const currentMeta = STEP_META[step - 1];
  const stepValid = isStepValid(step, answers);

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-glow mb-5">
            <ScanSearch className="w-8 h-8 text-white" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">AI-Powered Recommendation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-balance">
            Smart Device Finder
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto text-balance">
            Answer a few questions and get the best recommendations based on your needs.
          </p>
        </motion.div>

        {/* ── Content ── */}
        <AnimatePresence mode="wait">

          {/* QUIZ */}
          {phase === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-7">
                <StepProgress currentStep={step} totalSteps={TOTAL_STEPS} />
              </div>

              <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-soft">
                {/* Step header */}
                <div className="px-6 pt-6 pb-4 border-b border-border">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge variant="secondary" className="text-xs">Step {currentMeta.step}</Badge>
                  </div>
                  <h2 className="text-xl font-bold">{currentMeta.title}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{currentMeta.description}</p>
                </div>

                {/* Step content */}
                <div className="px-6 py-5 min-h-[280px]">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={slideTransition}
                    >
                      {step === 1 && (
                        <OptionGrid
                          options={DEVICE_OPTIONS}
                          value={answers.deviceType}
                          onSelect={(v) => setAnswers((a) => ({ ...a, deviceType: v }))}
                          cols={3}
                        />
                      )}
                      {step === 2 && (
                        <OptionGrid
                          options={BUDGET_OPTIONS}
                          value={answers.budget}
                          onSelect={(v) => setAnswers((a) => ({ ...a, budget: v }))}
                          cols={2}
                        />
                      )}
                      {step === 3 && (
                        <OptionGrid
                          options={USE_OPTIONS}
                          value={answers.primaryUse}
                          onSelect={(v) => setAnswers((a) => ({ ...a, primaryUse: v }))}
                          cols={3}
                        />
                      )}
                      {step === 4 && (
                        <OptionGrid
                          options={BRAND_OPTIONS}
                          value={answers.brand}
                          onSelect={(v) => setAnswers((a) => ({ ...a, brand: v }))}
                          cols={3}
                        />
                      )}
                      {step === 5 && (
                        <OptionGrid
                          options={PERFORMANCE_OPTIONS}
                          value={answers.performance}
                          onSelect={(v) => setAnswers((a) => ({ ...a, performance: v }))}
                          cols={3}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Nav footer */}
                <div className="px-6 pb-6 flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full gap-2"
                    onClick={goBack}
                    disabled={step === 1}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  {!stepValid && (
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      Select an option to continue
                    </span>
                  )}
                  <Button
                    className="rounded-full gap-2 shadow-glow"
                    onClick={goNext}
                    disabled={!stepValid}
                  >
                    {step === TOTAL_STEPS ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Find My Device
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* LOADING */}
          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-center py-12"
            >
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-glow animate-pulse">
                  <ScanSearch className="w-10 h-10 text-white" />
                </div>
                {[1, 2].map((i) => (
                  <span
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-blue-400/40 animate-ping"
                    style={{ animationDelay: `${i * 350}ms`, animationDuration: '1.4s' }}
                  />
                ))}
              </div>
              <h3 className="text-xl font-bold mb-2">Analysing your preferences…</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Finding the best matches across our catalogue.
              </p>
              <ResultSkeleton />
            </motion.div>
          )}

          {/* RESULTS */}
          {phase === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <button
                    onClick={startAgain}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-600 transition-colors mb-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Retake questionnaire
                  </button>
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    {results.length} matches found
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on your {answers.deviceType?.toLowerCase()} needs for {answers.primaryUse?.toLowerCase()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full gap-2 shrink-0"
                  onClick={startAgain}
                >
                  <RotateCcw className="w-4 h-4" />
                  Start Again
                </Button>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((r, i) => (
                    <ResultCard key={r.product.id} result={r} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <ScanSearch className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Try adjusting your budget or device type.
                  </p>
                  <Button className="rounded-full gap-2" onClick={startAgain}>
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </Button>
                </div>
              )}

              {/* Additional CTA */}
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.35 }}
                  className="mt-8 p-5 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-sm">Want more options?</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Browse the full catalogue or chat with our AI assistant.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/products">
                      <Button variant="outline" size="sm" className="rounded-full gap-1.5">
                        Browse All
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Link href="/ai-assistant">
                      <Button size="sm" className="rounded-full gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Assistant
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
