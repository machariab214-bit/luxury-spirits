import { NextResponse } from 'next/server';
import { contentfulFetch, CONTENTFUL_QUERIES } from '@/lib/contentful';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'products';

    let query = '';
    let variables = {};

    switch (type) {
      case 'products':
        query = CONTENTFUL_QUERIES.GET_PRODUCTS;
        break;
      case 'featured':
        query = CONTENTFUL_QUERIES.GET_FEATURED_PRODUCTS;
        break;
      case 'blog':
        query = CONTENTFUL_QUERIES.GET_BLOG_POSTS;
        break;
      case 'recipes':
        query = `
          query GetRecipes {
            recipeCollection(order: sys_publishedAt_DESC) {
              items {
                sys { id }
                title
                slug
                heroImage { url }
                difficulty
                ingredients
                instructions
                prepTime
                serves
                description
                baseSpirit {
                  title
                  image { url }
                }
              }
            }
          }
        `;
        break;
      case 'product':
        const id = searchParams.get('id');
        if (!id) {
          return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }
        query = CONTENTFUL_QUERIES.GET_PRODUCT(id);
        break;
      case 'recipe':
        const slug = searchParams.get('slug');
        if (!slug) {
          return NextResponse.json({ error: 'Recipe slug required' }, { status: 400 });
        }
        query = `
          query GetRecipeBySlug($slug: String!) {
            recipeCollection(where: { slug: $slug }, limit: 1) {
              items {
                sys { id }
                title
                slug
                heroImage { url }
                difficulty
                ingredients
                instructions
                prepTime
                serves
                description
                baseSpirit {
                  title
                  image { url }
                }
              }
            }
          }
        `;
        variables = { slug };
        break;
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    const data = await contentfulFetch(query, variables);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Contentful API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content from Contentful' },
      { status: 500 }
    );
  }
}