import Link from 'next/link';
import { getAllRecipes } from '@/lib/recipes';

export default async function RecipesPage() {
  const recipes = await getAllRecipes();

  return (
    <main className="min-h-screen bg-[#0C0C0C] text-white">
      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-serif mb-6 text-[#D4AF37]">
            Cocktail Recipes
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Master the art of mixology with our curated collection of premium cocktail recipes,
            each designed to showcase the finest spirits in your collection.
          </p>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <Link
              key={recipe.sys.id}
              href={`/recipe/${recipe.slug}`}
              className="group block"
            >
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={recipe.heroImage.url}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[#D4AF37] text-sm uppercase tracking-widest font-semibold">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-serif mb-2 text-[#D4AF37] group-hover:text-white transition-colors">
                    {recipe.title}
                  </h3>

                  {recipe.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {recipe.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {recipe.prepTime && (
                      <span>{recipe.prepTime} min prep</span>
                    )}
                    {recipe.serves && (
                      <span>Serves {recipe.serves}</span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center text-[#D4AF37] group-hover:text-white transition-colors">
                    <span className="text-sm font-semibold">View Recipe</span>
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No recipes available yet. Check back soon!</p>
          </div>
        )}
      </section>
    </main>
  );
}