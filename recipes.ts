import { contentfulFetch } from './contentful';

export interface Recipe {
  sys: { id: string };
  title: string;
  slug: string;
  heroImage: { url: string };
  difficulty: string;
  ingredients: string[];
  instructions: string;
  baseSpirit: {
    title: string;
    image: string;
  };
  prepTime?: number;
  serves?: number;
  description?: string;
}

export async function getRecipeBySlug(slug: string): Promise<Recipe> {
  const query = `
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

  const data = await contentfulFetch(query, { slug });

  if (!data.data?.recipeCollection?.items?.[0]) {
    throw new Error(`Recipe with slug "${slug}" not found`);
  }

  return data.data.recipeCollection.items[0];
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const query = `
    query GetAllRecipes {
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

  const data = await contentfulFetch(query);
  return data.data?.recipeCollection?.items || [];
}

export async function getRecipesByDifficulty(difficulty: string): Promise<Recipe[]> {
  const query = `
    query GetRecipesByDifficulty($difficulty: String!) {
      recipeCollection(where: { difficulty: $difficulty }, order: sys_publishedAt_DESC) {
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

  const data = await contentfulFetch(query, { difficulty });
  return data.data?.recipeCollection?.items || [];
}