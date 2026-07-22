import { PageShell } from '@/components/page-shell';
import { HeroSection } from '@/components/sections/hero-section';
import { PopularCategories } from '@/components/sections/popular-categories';
import { FeaturedProducts, TodaysDeals } from '@/components/sections/featured-products';
import { TopBrands } from '@/components/sections/top-brands';
import { AIAssistantSection } from '@/components/sections/ai-assistant-section';
import { Testimonials } from '@/components/sections/testimonials';

export default function Home() {
  return (
    <PageShell>
      <HeroSection />
      <PopularCategories />
      <FeaturedProducts />
      <TodaysDeals />
      <TopBrands />
      <AIAssistantSection />
      <Testimonials />
    </PageShell>
  );
}
