'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen flex">
      {/* Left side — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-bold text-lg">TechNest<span className="text-blue-600"> AI</span></span>
          </Link>

          <h1 className="text-2xl font-bold mb-1">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {isLogin ? 'Sign in to continue shopping' : 'Join TechNest AI for smart shopping'}
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div>
                <Label>Full Name</Label>
                <Input placeholder="John Doe" className="rounded-xl" />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" className="pl-10 rounded-xl" />
              </div>
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10 rounded-xl" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" /> Remember me
                </label>
                <Link href="#" className="text-blue-600 hover:underline">Forgot password?</Link>
              </div>
            )}

            <Button type="submit" className="w-full rounded-xl gap-2 shadow-glow" size="lg">
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="rounded-xl gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500" /> Google
            </Button>
            <Button variant="outline" className="rounded-xl gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-700" /> Apple
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link href={isLogin ? '/signup' : '/login'} className="text-blue-600 font-medium hover:underline">
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side — showcase */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-cyan-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-300/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative text-white max-w-md"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Shopping</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Smart shopping starts here
          </h2>
          <p className="text-white/80 mb-8">
            Get personalized recommendations, AI-powered comparisons, and the best deals on premium electronics.
          </p>
          <div className="space-y-3">
            {['AI Shopping Assistant', 'Smart Budget Builder', 'AI Product Comparison'].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
