'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Header from "@/components/store/Header";
import { ProductFilter } from '@/components/store/ProductFilter';

// Enhanced Mock Data
const ALL_PRODUCTS = [
    {
        id: '1',
        name: 'MacBook Pro 16" M3 Max',
        category: 'laptops',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000',
        specs: '36GB RAM, 1TB SSD',
        rating: 4.9,
        brand: 'Apple',
        specifications: { RAM: '36GB', Storage: '1TB' }
    },
    {
        id: '2',
        name: 'Dell XPS 13 Plus',
        category: 'laptops',
        price: 1499,
        image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=1000',
        specs: '16GB RAM, 512GB SSD',
        rating: 4.5,
        brand: 'Dell',
        specifications: { RAM: '16GB', Storage: '512GB' }
    },
    {
        id: '3',
        name: 'iPhone 15 Pro Max',
        category: 'phones',
        price: 1199,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000',
        specs: '256GB, Titanium',
        rating: 4.8,
        brand: 'Apple',
        specifications: { Storage: '256GB', Material: 'Titanium' }
    },
    {
        id: '4',
        name: 'Sony WH-1000XM5',
        category: 'accessories',
        price: 348,
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000',
        specs: 'Noise Cancelling',
        rating: 4.7,
        brand: 'Sony',
        specifications: { Type: 'Over-ear', Feature: 'Noise Cancelling' }
    },
    {
        id: '5',
        name: 'Gaming Desktop RTX 4090',
        category: 'desktops',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000',
        specs: 'i9-14900K, 64GB RAM',
        rating: 5.0,
        brand: 'Alienware',
        specifications: { CPU: 'i9-14900K', RAM: '64GB' }
    },
    {
        id: '6',
        name: 'Samsung Galaxy S24 Ultra',
        category: 'phones',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=1000',
        specs: '512GB, AI Features',
        rating: 4.8,
        brand: 'Samsung',
        specifications: { Storage: '512GB' }
    },
    {
        id: '7',
        name: 'iPad Pro 12.9"',
        category: 'tablets',
        price: 1099,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000',
        specs: 'M2 Chip, Liquid Retina XDR',
        rating: 4.9,
        brand: 'Apple',
        specifications: { Chip: 'M2' }
    }
];

function ProductGridContent() {
    const searchParams = useSearchParams();
    const urlCategory = searchParams.get('category');

    // Initial State defaults
    const [filters, setFilters] = useState({
        priceRange: [0, 5000] as [number, number],
        categories: urlCategory ? [urlCategory] : [],
        brands: [] as string[],
    });

    // Derive available options from data
    const { brands, categories, minPrice, maxPrice } = useMemo(() => {
        const brandsStr = new Set<string>();
        const catsStr = new Set<string>();
        let min = Number.MAX_VALUE;
        let max = 0;

        ALL_PRODUCTS.forEach(p => {
            brandsStr.add(p.brand);
            catsStr.add(p.category);
            if (p.price < min) min = p.price;
            if (p.price > max) max = p.price;
        });

        return {
            brands: Array.from(brandsStr),
            categories: Array.from(catsStr),
            minPrice: 0, // Fixed start at 0
            maxPrice: Math.ceil(max / 100) * 100 // Round up to nearest 100
        };
    }, []);

    // Effect to update filters if URL changes (optional, but good for navigation)
    React.useEffect(() => {
        if (urlCategory) {
            setFilters(prev => {
                if (!prev.categories.includes(urlCategory)) {
                    return { ...prev, categories: [urlCategory] };
                }
                return prev;
            });
        }
    }, [urlCategory]);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        return ALL_PRODUCTS.filter(product => {
            // Price Filter
            if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
                return false;
            }

            // Category Filter
            if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
                return false;
            }

            // Brand Filter
            if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
                return false;
            }

            return true;
        });
    }, [filters]);

    const activeFiltersCount = filters.categories.length + filters.brands.length + (filters.priceRange[1] < 5000 ? 1 : 0);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header / Breadcrumbs */}
            <div className="mb-8">
                <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 mb-2 inline-block">&larr; Back to Home</Link>
                <h1 className="text-4xl font-bold tracking-tight">Products {urlCategory ? `- ${urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)}` : ''}</h1>
                <p className="text-gray-500 mt-2">
                    Showing {filteredProducts.length} results
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar Filter */}
                <aside className="w-full lg:w-1/4">
                    <Card className="p-4 sticky top-24">
                        <ProductFilter
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            categories={categories}
                            brands={brands}
                            currFilters={filters}
                            setFilters={setFilters}
                        />
                    </Card>
                </aside>

                {/* Right Product Grid */}
                <div className="w-full lg:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-sm text-muted-foreground">
                            {activeFiltersCount > 0 ? `${activeFiltersCount} filters active` : 'No filters active'}
                        </div>
                        <div className="flex gap-2">
                            {/* Clear Filter Button could go here */}
                            {activeFiltersCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFilters({ priceRange: [0, 5000], categories: [], brands: [] })}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    Clear All
                                </Button>
                            )}
                            <Button variant="outline" size="sm">Sort by: Featured</Button>
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
                            <h3 className="text-xl font-semibold mb-2">No products found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your filters.</p>
                            <Button
                                variant="outline"
                                onClick={() => setFilters({ priceRange: [0, 5000], categories: [], brands: [] })}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur-sm">
                                                ★ {product.rating}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">{product.category}</p>
                                                <h3 className="font-bold text-lg leading-tight mt-1 mb-1">{product.name}</h3>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.specs}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xl font-bold">${product.price.toLocaleString()}</span>
                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Add</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <Suspense fallback={<div className="p-10 text-center">Loading products...</div>}>
                <ProductGridContent />
            </Suspense>
        </div>
    );
}
