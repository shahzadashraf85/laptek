'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from "@/components/store/Header";
import { AnnouncementBar } from '@/components/store/AnnouncementBar';
import { HeroCarousel } from '@/components/store/home/HeroCarousel';
import { CategoryGrid } from '@/components/store/home/CategoryGrid';
import { InfoBar } from '@/components/store/home/InfoBar';
import { DealsSection } from '@/components/store/home/DealsSection';
import { Testimonials } from '@/components/store/home/Testimonials';
import { StatsSection } from '@/components/store/home/StatsSection';
import { Newsletter } from '@/components/store/home/Newsletter';
import { LiveChat } from '@/components/store/LiveChat';
import { Card } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface FeaturedProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  specs: string;
  rating: number;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        // Fetch 4 most recent products as "Trending"
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(4));
        const snapshot = await getDocs(q);

        const products = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.title || 'Untitled',
            category: (data.category_code?.split('/')[1] || data.category_code || 'Uncategorized').toLowerCase(),
            price: data.offer?.price || 0,
            image: data.main_image_url || 'https://placehold.co/400',
            specs: Object.entries(data.specifications || {}).map(([k, v]) => `${v}`).join(', ').substring(0, 30) + '...',
            rating: data.stats?.rating || 5
          };
        });

        setFeaturedProducts(products);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AnnouncementBar />
      <Header />

      <HeroCarousel />

      <InfoBar />

      <DealsSection />

      <CategoryGrid />

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trending Now</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Discover our most popular products, top-rated by customers and tech enthusiasts alike.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 h-full bg-white">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.price < 500 && (
                        <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                          Sale
                        </Badge>
                      )}
                      <Button
                        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full shadow-lg"
                        size="sm"
                      >
                        Quick View
                      </Button>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs font-normal bg-gray-50 uppercase tracking-wider">
                          {product.category}
                        </Badge>
                        <div className="flex items-center text-yellow-400 text-xs">
                          {'★'.repeat(Math.round(product.rating))}
                          <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating))}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 truncate">
                        {product.specs}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">${product.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline" className="min-w-[200px] border-2">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      <StatsSection />

      <Newsletter />
    </div>
  );
}
