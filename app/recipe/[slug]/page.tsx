'use client';

import { useState, useEffect } from 'react';
import { getRecipeBySlug } from '@/lib/recipes';
import { trackEvent } from '@/lib/analytics';

interface Recipe {
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

export default function RecipePage({
  params,
}: {
  params: { slug: string };
}) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeBySlug(params.slug);
        setRecipe(data);

        // Track recipe view
        trackEvent('recipe_view', {
          recipe_id: data.sys.id,
          recipe_title: data.title,
          difficulty: data.difficulty,
        });
      } catch (error) {
        console.error('Failed to fetch recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0C0C0C] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading recipe...</p>
        </div>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="min-h-screen bg-[#0C0C0C] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">Recipe Not Found</h1>
          <p className="text-gray-400">The recipe you're looking for doesn't exist.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0C0C0C] text-white">
      {/* Cinematic Recipe Hero */}
      <section className="relative h-[70vh] w-full">
        <img
          src={recipe.heroImage.url}
          className="w-full h-full object-cover opacity-60"
          alt={recipe.title}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent" />

        <div className="absolute bottom-12 left-6 md:left-20">
          <span className="text-[#D4AF37] uppercase tracking-widest text-sm">
            {recipe.difficulty}
          </span>

          <h1 className="text-5xl md:text-7xl font-serif mt-4">
            {recipe.title}
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left: Ingredients */}
        <div className="lg:col-span-1 border-r border-white/10 pr-8">
          <h3 className="text-xl font-serif mb-6 text-[#D4AF37]">
            Ingredients
          </h3>

          <ul className="space-y-4 text-gray-300">
            {recipe.ingredients.map((item: string, i: number) => (
              <li
                key={i}
                className="pb-4 border-b border-white/5"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Center: Preparation */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-serif mb-6 text-[#D4AF37]">
            The Method
          </h3>

          <div className="prose prose-invert max-w-none prose-gold leading-relaxed">
            {/* Render Contentful Rich Text Here */}
            <p>{recipe.instructions}</p>
          </div>

          {/* Featured Product (Conversion Hook) */}
          <div className="mt-16 p-8 bg-white/5 border border-[#D4AF37]/20 rounded-2xl flex flex-col md:flex-row items-center gap-8">

            <img
              src={recipe.baseSpirit.image}
              className="w-32 h-auto"
              alt="Spirit"
            />

            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl font-serif mb-2">
                The Essential Pour
              </h4>

              <p className="text-gray-400 text-sm mb-4">
                Master this recipe with the {recipe.baseSpirit.title}.
              </p>

              <button
                onClick={() => {
                  trackEvent('recipe_to_product_conversion', {
                    recipe_id: recipe.sys.id,
                    recipe_title: recipe.title,
                    product_title: recipe.baseSpirit.title,
                  });
                }}
                className="bg-[#D4AF37] text-black px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#FFBF00] transition-colors"
              >
                Shop The Spirit
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}