import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/providers/query-provider';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import CartDrawer from '@/components/features/cart/cart-drawer';
import VariantSelectorModal from '@/components/features/products/variant-selector-modal';
import SearchModal from '@/components/features/search/search-modal';
import SizeGuideModal from '@/components/features/products/size-guide-modal';
import WishlistDrawer from '@/components/features/wishlist/wishlist-drawer';
import GlobalParticlesWrapper from '@/components/common/global-particles-wrapper';
import LiveSalesToast from '@/components/common/live-sales-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'VELORA TEES | Trending Graphic Apparel & POD Merch',
  description: 'Trending graphic printed t-shirts, horror movie apparel, halloween merchandise and custom printed tees.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#0b0b0b] text-[#fcf7fa] antialiased">
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <VariantSelectorModal />
          <SearchModal />
          <SizeGuideModal />
          <WishlistDrawer />
          <GlobalParticlesWrapper />
          <LiveSalesToast />
        </QueryProvider>
      </body>
    </html>
  );
}
