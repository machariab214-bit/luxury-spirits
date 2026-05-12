const contentfulSpace = process.env.CONTENTFUL_SPACE_ID;
const contentfulToken = process.env.CONTENTFUL_ACCESS_TOKEN;

async function contentfulFetch(query: string, variables?: Record<string, any>) {
  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${contentfulSpace}`;

  if (!contentfulSpace || !contentfulToken) {
    throw new Error('Contentful environment variables not configured');
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${contentfulToken}`,
      },
      body: JSON.stringify({ query, ...(variables && { variables }) }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`Contentful API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Check for GraphQL errors
    if (data.errors) {
      console.error('Contentful GraphQL errors:', data.errors);
      throw new Error(`GraphQL query failed: ${data.errors[0]?.message || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    console.error('Contentful fetch error:', error);
    throw error; // Re-throw to allow calling code to handle
  }
}

// Example queries for common content operations
export const CONTENTFUL_QUERIES = {
  // Get all products with basic info
  GET_PRODUCTS: `
    query GetProducts {
      productCollection {
        items {
          sys { id }
          title
          description
          price
          image { url }
          category
          inStock
        }
      }
    }
  `,

  // Get single product by ID
  GET_PRODUCT: (id: string) => `
    query GetProduct {
      product(id: "${id}") {
        sys { id }
        title
        description
        price
        image { url }
        category
        inStock
        tastingNotes
        abv
        volume
        origin
      }
    }
  `,

  // Get blog posts
  GET_BLOG_POSTS: `
    query GetBlogPosts {
      blogPostCollection(order: publishDate_DESC) {
        items {
          sys { id }
          title
          slug
          excerpt
          publishDate
          author { name }
          featuredImage { url }
          content { json }
        }
      }
    }
  `,

  // Get featured products for homepage
  GET_FEATURED_PRODUCTS: `
    query GetFeaturedProducts {
      productCollection(where: { featured: true }) {
        items {
          sys { id }
          title
          description
          price
          image { url }
          category
        }
      }
    }
  `,
};

export { contentfulFetch };
export default contentfulFetch;