'use client';

import { createCheckout } from '@/lib/shopify';
import { trackPurchase } from '@/lib/analytics';

interface AddToCartButtonProps {
  variantId: string;
  productId?: string;
  productName?: string;
  price?: number;
  quantity?: number;
}

export function AddToCartButton({
  variantId,
  productId = '',
  productName = '',
  price = 0,
  quantity = 1
}: AddToCartButtonProps) {
  const handlePurchase = async () => {
    // Track the purchase event
    trackPurchase(productId, productName, price, quantity);

    // 1. Create a checkout instance in Shopify
    const checkoutUrl = await createCheckout(variantId, quantity);

    // 2. Redirect to the secure, branded checkout page
    window.location.href = checkoutUrl;
  };

  return (
    <button
      onClick={handlePurchase}
      className="w-full py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-[#FFBF00] transition-all"
    >
      Secure Your Bottle
    </button>
  );
}