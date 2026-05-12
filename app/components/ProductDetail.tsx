import { Star, Truck, ShieldCheck, Droplets } from 'lucide-react';
import Product360Viewer from './Product360Viewer';
import { MobileProductGallery } from './MobileProductGallery';
import { AddToCartButton } from './AddToCartButton';
import { trackProductView, trackEvent } from '@/lib/analytics';
import { useEffect } from 'react';

export default function ProductDetail() {
  useEffect(() => {
    // Track product view when component mounts
    trackProductView(
      'obsidian-reserve-18yr',
      'The Obsidian Reserve: 18 Year Single Malt',
      'Single Malt Scotch'
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0C0C] pt-24 pb-12">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* LEFT COLUMN: Visuals */}
        <div className="lg:sticky lg:top-24 h-fit">
          {/* Desktop 360 Viewer */}
          <div className="hidden lg:block">
            <Product360Viewer />
          </div>

          {/* Mobile Swipe Gallery */}
          <div className="lg:hidden">
            <MobileProductGallery frames={[]} />
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8 opacity-60">
            {/* Visualizing Tasting Notes via Micro-Icons */}
            <div className="text-center p-4 border border-white/5 rounded-xl bg-white/5">
              <Droplets className="mx-auto text-[#D4AF37] mb-2" size={20} />
              <span className="text-[10px] uppercase">Peaty</span>
            </div>

            {/* ... other notes ... */}
          </div>
        </div>

        {/* RIGHT COLUMN: Details & Conversion */}
        <div className="flex flex-col space-y-8">

          <div>
            <span className="text-[#D4AF37] uppercase tracking-widest text-sm font-semibold">
              Limited Allocation
            </span>

            <h1 className="text-5xl font-serif mt-2 mb-4">
              The Obsidian Reserve: 18 Year Single Malt
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex text-amber-500">
                <Star fill="currentColor" size={16} />
                <Star fill="currentColor" size={16} />
                <Star fill="currentColor" size={16} />
                <Star fill="currentColor" size={16} />
                <Star fill="currentColor" size={16} />
              </div>

              <span className="text-sm text-gray-400">(128 Reviews)</span>
            </div>
          </div>

          <div className="text-4xl font-light tracking-tight">
            $349.00
          </div>

          <p className="text-gray-400 leading-relaxed text-lg italic">
            "A masterclass in complexity. Notes of dried plum, dark chocolate, and a lingering smoke that whispers of Islay's rugged coast."
          </p>

          {/* Smart Upsell / Sizing */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">
              Select Volume
            </h4>

            <div className="flex gap-3">
              {['750ML', '1.5L MAGNUM'].map((size) => (
                <button
                  key={size}
                  className="px-6 py-3 border border-white/20 hover:border-[#D4AF37] rounded-md transition-colors text-sm"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Premium Accessories Upsell */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">
              Enhance Your Experience
            </h4>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                    <Droplets className="text-[#D4AF37]" size={20} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">Premium Ice Spheres</h5>
                    <p className="text-xs text-gray-400">Crystal-clear spheres for slow-melting perfection</p>
                    <p className="text-[#D4AF37] font-bold text-sm">+ KSH 2,500</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    trackEvent('upsell_click', {
                      original_item: 'Whiskey',
                      upsell_item: 'Premium Ice Spheres',
                    });
                  }}
                  className="px-4 py-2 bg-[#D4AF37] text-black text-sm font-bold rounded-md hover:bg-[#FFBF00] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Conversion Bar */}
          <div className="flex flex-col gap-4 py-6 border-y border-white/10">

            <AddToCartButton
              variantId="gid://shopify/ProductVariant/123456789"
              productId="obsidian-reserve-18yr"
              productName="The Obsidian Reserve: 18 Year Single Malt"
              price={349.00}
              quantity={1}
            />

            <div className="flex justify-between items-center px-2">

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Truck size={14} />
                Fast Global Delivery
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} />
                Authenticity Guaranteed
              </div>

            </div>
          </div>

          {/* Inventory Scarcity */}
          <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-red-200">
              Only 7 bottles remain in this batch.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}