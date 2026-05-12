const domain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch({
  query,
  variables = {},
}: {
  query: string;
  variables?: any;
}) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken!,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Cache for 60 seconds (SEO friendly)
    });

    return await result.json();
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw new Error('Could not fetch products');
  }
}

// Example query functions
export async function getProducts(first: number = 10) {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  return shopifyFetch({ query, variables: { first } });
}

export async function getProduct(handle: string) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  return shopifyFetch({ query, variables: { handle } });
}

export async function getCustomerTier(customerToken: string) {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        metafield(namespace: "loyalty", key: "tier") {
          value
        }
      }
    }
  `;

  const variables = {
    customerAccessToken: customerToken,
  };

  const response = await shopifyFetch({ query, variables });

  const tier =
    response?.data?.customer?.metafield?.value ?? 'GUEST';

  return tier;
}

export async function getPremiumProducts() {
  const query = `
    query getProducts {
      products(first: 10, sortKey: CREATED_AT) {
        edges {
          node {
            id
            handle
            title
            descriptionHtml
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            # Custom Metafields for Flavor Notes
            flavorNotes: metafield(namespace: "custom", key: "flavor_profile") {
              value
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query });
  return response.data.products.edges.map((edge: any) => edge.node);
}

export async function createCheckout(variantId: string, quantity: number) {
  const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: [{ variantId, quantity }],
    },
  };

  const response = await shopifyFetch({ query: mutation, variables });
  return response.data.checkoutCreate.checkout.webUrl;
}