# Contentful CMS Integration

This project includes Contentful headless CMS integration for managing dynamic content like products, blog posts, and other marketing materials.

## Setup

### 1. Environment Variables

Add the following to your `.env.local` file:

```env
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
```

### 2. Contentful Space Configuration

Create the following content types in your Contentful space:

#### Product Content Type
- **title** (Short text) - Product name
- **description** (Long text) - Product description
- **price** (Number, integer) - Price in KSH
- **image** (Media) - Product image
- **category** (Short text) - Product category (e.g., "Single Malt", "Bourbon")
- **inStock** (Boolean) - Availability status
- **featured** (Boolean) - Featured product flag
- **tastingNotes** (Long text) - Detailed tasting notes
- **abv** (Number, decimal) - Alcohol by volume percentage
- **volume** (Short text) - Bottle size (e.g., "750ML", "1.5L")
- **origin** (Short text) - Country/region of origin

#### Blog Post Content Type
- **title** (Short text) - Article title
- **slug** (Short text) - URL slug
- **excerpt** (Long text) - Brief summary
- **publishDate** (Date & time) - Publication date
- **author** (Reference) - Author reference
- **featuredImage** (Media) - Hero image
- **content** (Rich text) - Full article content

#### Recipe Content Type
- **title** (Short text) - Recipe name
- **slug** (Short text) - URL slug for the recipe page
- **heroImage** (Media) - Main recipe image
- **difficulty** (Short text) - Difficulty level (e.g., "Beginner", "Advanced")
- **ingredients** (Short text, multiple) - List of ingredients
- **instructions** (Long text) - Step-by-step preparation instructions
- **prepTime** (Number, integer) - Preparation time in minutes
- **serves** (Number, integer) - Number of servings
- **description** (Long text) - Brief recipe description
- **baseSpirit** (Reference to Product) - Reference to the main spirit used

## Usage

### API Routes

Fetch content via API routes:

```typescript
// Get all products
GET /api/contentful?type=products

// Get featured products
GET /api/contentful?type=featured

// Get blog posts
GET /api/contentful?type=blog

// Get single product
GET /api/contentful?type=product&id=your_product_id
```

### Client-Side Usage

```tsx
import ContentfulProducts from '@/components/ContentfulProducts';

// Display products from Contentful
<ContentfulProducts />
```

### Direct API Usage

```typescript
import { contentfulFetch, CONTENTFUL_QUERIES } from '@/lib/contentful';

// Fetch products
const data = await contentfulFetch(CONTENTFUL_QUERIES.GET_PRODUCTS);
const products = data.data.productCollection.items;
```

## Features

- **GraphQL Integration**: Uses Contentful's GraphQL API
- **Caching**: 1-hour cache for improved performance
- **Type Safety**: TypeScript interfaces for content types
- **Error Handling**: Comprehensive error handling and fallbacks
- **Loading States**: Built-in loading and error states in components

## Content Management

### Adding Products

1. Go to your Contentful space dashboard
2. Navigate to "Content" → "Product"
3. Click "Add entry"
4. Fill in product details
5. Upload product image
6. Set availability and featured status
7. Publish the entry

### Managing Blog Content

1. Create blog post entries in Contentful
2. Use rich text editor for content
3. Add metadata (author, publish date, etc.)
4. Upload featured images
5. Publish when ready

## Benefits

- **Dynamic Content**: Update products and content without code changes
- **SEO Friendly**: Server-side rendering with fresh content
- **Scalable**: Handle large catalogs and content libraries
- **Multi-channel**: Same content can be used across web and mobile
- **Version Control**: Contentful provides version history and publishing workflows