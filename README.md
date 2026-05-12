This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Shopify Integration

This project includes Shopify Storefront API integration for e-commerce functionality.

### Setup

1. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Shopify credentials:
   - **Storefront Access Token**: Go to Shopify Admin > Apps > Storefront API > Create Token
   - **Store Domain**: Your Shopify store URL (e.g., `your-brand-name.myshopify.com`)

3. Update `.env.local` with your actual credentials:
   ```
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_actual_token_here
   SHOPIFY_STORE_DOMAIN=your-actual-store.myshopify.com
   ```

### Usage

Use the Shopify client in `lib/shopify.ts` to fetch data:

```typescript
import { getProducts, getProduct } from '@/lib/shopify';

// Get all products
const products = await getProducts(20);

// Get specific product
const product = await getProduct('product-handle');
```

## OpenAI Sommelier Integration

This project includes an AI-powered Master Sommelier chatbot using OpenAI's GPT-4.

### Setup

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### API Endpoint

**POST** `/api/sommelier`

Request body:
```json
{
  "messages": [
    {"role": "user", "content": "What whiskey pairs well with steak?"}
  ],
  "productList": [
    {"name": "Obsidian Reserve", "flavorNotes": "Peaty, Dark Chocolate"}
  ]
}
```

### Usage Example

The AI Sommelier is automatically included as a floating widget on all pages. Click the gold chat button in the bottom-right corner to consult with your virtual sommelier.

```typescript
// The widget is automatically included in layout.tsx
// No additional setup required for basic usage

// For custom product integration, update the productList in AISommelier.tsx
const res = await fetch('/api/sommelier', {
  method: 'POST',
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'What pairs with steak?' }],
    productList: yourShopifyProducts // Pass real product data
  })
});
```

## Black Card VIP Dashboard

Exclusive membership dashboard for premium customers featuring:

### Features:
- **Member Status**: Black Card tier with points and benefits
- **Private Allocations**: Reserved access to limited-edition bottles
- **Personal Sommelier**: 24/7 AI consultation service
- **Event Access**: Exclusive tasting events and experiences

### Access:
- **URL**: `/dashboard`
- **Component**: `BlackCardDashboard.tsx`
- **Authentication**: Requires member login (to be implemented)

### Required Assets:
- **Image**: `public/images/rare-bottle.jpg` - Featured exclusive bottle
- **Styling**: Uses existing luxury theme with enhanced dark mode

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
