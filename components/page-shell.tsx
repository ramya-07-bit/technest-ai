'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ThemeToggle } from '@/components/theme-toggle';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <div className="fixed bottom-6 right-6 z-40">
        <ThemeToggle />
      </div>
    </div>
  );
}
