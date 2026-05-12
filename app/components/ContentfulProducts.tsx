'use client';

import { useState, useEffect } from 'react';
import { contentfulFetch, CONTENTFUL_QUERIES } from '@/lib/contentful';

interface Product {
  sys: { id: string };
  title: string;
  description: string;
  price: number;
  image?: { url: string };
  category: string;
  inStock: boolean;
}

export default function ContentfulProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await contentfulFetch(CONTENTFUL_QUERIES.GET_PRODUCTS);
        setProducts(data.data?.productCollection?.items || []);
      } catch (err) {
        setError('Failed to load products');
        console.error('Contentful fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.sys.id}
          className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors"
        >
          {product.image && (
            <img
              src={product.image.url}
              alt={product.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          <div className="space-y-2">
            <h3 className="text-xl font-serif text-[#D4AF37]">{product.title}</h3>
            <p className="text-gray-400 text-sm">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">
                KSH {product.price?.toLocaleString()}
              </span>
              <span className={`text-sm px-2 py-1 rounded ${
                product.inStock
                  ? 'bg-green-900/20 text-green-400'
                  : 'bg-red-900/20 text-red-400'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              {product.category}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}