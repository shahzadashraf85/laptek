'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from "@/components/store/Header";
import { HeroCarousel } from '@/components/store/home/HeroCarousel';
import { CategoryGrid } from '@/components/store/home/CategoryGrid';
import { InfoBar } from '@/components/store/home/InfoBar';
import { Newsletter } from '@/components/store/home/Newsletter';
import { ALL_PRODUCTS } from '@/lib/products';
import { Card } from '@/components/ui/card';

export default function Home() {
  const featuredProducts = ALL_PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <HeroCarousel />

      <InfoBar />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 h-full bg-white">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.rating >= 4.8 && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-orange-500 hover:bg-orange-600">Best Seller</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wider mb-2">{product.category}</p>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold">${product.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">★ {product.rating}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Marquee (Static for now) */}
      <section className="py-12 border-y">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium text-gray-400 mb-8 uppercase tracking-widest">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Simple text placeholders for brands, normally would be SVGs */}
            <span className="text-2xl font-bold">APPLE</span>
            <span className="text-2xl font-bold">SAMSUNG</span>
            <span className="text-2xl font-bold">DELL</span>
            <span className="text-2xl font-bold">SONY</span>
            <span className="text-2xl font-bold">ALIENWARE</span>
            <span className="text-2xl font-bold">ASUS</span>
          </div>
        </div>
      </section>

      <Newsletter />

      <footer className="bg-white border-t py-12 text-sm">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">LAPTEK</h3>
            <p className="text-gray-500 max-w-xs">
              Your premier destination for next-gen IT gear. Featuring the latest tech from top brands.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-500">
              <li><Link href="/products?category=laptops" className="hover:text-blue-600">Laptops</Link></li>
              <li><Link href="/products?category=phones" className="hover:text-blue-600">Phones</Link></li>
              <li><Link href="/products?category=desktops" className="hover:text-blue-600">Desktops</Link></li>
              <li><Link href="/products?category=accessories" className="hover:text-blue-600">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-500">
              <li><Link href="/profile" className="hover:text-blue-600">My Account</Link></li>
              <li><Link href="/profile" className="hover:text-blue-600">Order Status</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Returns</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-500">
              <li><Link href="#" className="hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-gray-400">
          © 2026 LapTek Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
