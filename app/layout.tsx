import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { StoreProvider } from '@/components/store-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TechNest AI — Smart Electronics Shopping with AI',
  description:
    'Discover laptops, mobiles, gaming accessories, smart devices and more. AI-powered shopping for the best electronics.',
  openGraph: {
    title: 'TechNest AI — Smart Electronics Shopping with AI',
    description:
      'Discover laptops, mobiles, gaming accessories, smart devices and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechNest AI',
    description: 'Smart Electronics Shopping with AI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>{children}</StoreProvider>
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
