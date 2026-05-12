export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...properties,
      timestamp: new Date().toISOString(),
      currency: 'KSH',
    });
  }
};

export const trackPurchase = (
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1
) => {
  trackEvent('purchase', {
    product_id: productId,
    product_name: productName,
    value: price * quantity,
    quantity,
    currency: 'KSH',
  });
};

export const trackProductView = (
  productId: string,
  productName: string,
  category?: string
) => {
  trackEvent('view_item', {
    product_id: productId,
    product_name: productName,
    category,
  });
};

export const trackAddToCart = (
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1
) => {
  trackEvent('add_to_cart', {
    product_id: productId,
    product_name: productName,
    value: price * quantity,
    quantity,
    currency: 'KSH',
  });
};

export const trackUserLogin = (customerTier: string) => {
  trackEvent('login', {
    method: 'shopify_token',
    customer_tier: customerTier,
  });
};

export const trackDashboardView = (customerTier: string) => {
  trackEvent('dashboard_view', {
    customer_tier: customerTier,
  });
};