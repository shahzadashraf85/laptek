'use client';

import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Header from "@/components/store/Header";
import { ProductFilter } from '@/components/store/ProductFilter';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

// Type definition matches UI expectations
interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    specs: string;
    rating: number;
    brand: string;
    description: string;
}

function ProductGridContent() {
    const searchParams = useSearchParams();
    const urlCategory = searchParams.get('category');

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial State defaults
    const [filters, setFilters] = useState({
        priceRange: [0, 5000] as [number, number],
        categories: urlCategory ? [urlCategory] : [],
        brands: [] as string[],
    });

    // Fetch Products from Firestore
    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedProducts = snapshot.docs.map(doc => {
                const data = doc.data();
                // Map Firestore fields to UI fields
                return {
                    id: doc.id,
                    name: data.title || 'Untitled',
                    // Fallback to simple category extraction from code or raw string
                    category: (data.category_code?.split('/')[1] || data.category_code || 'Uncategorized').toLowerCase(),
                    price: data.offer?.price || 0,
                    image: data.main_image_url || 'https://placehold.co/400',
                    specs: Object.entries(data.specifications || {}).map(([k, v]) => `${v}`).join(', ').substring(0, 30) + '...',
                    rating: data.stats?.rating || 0,
                    brand: data.brand || 'Generic',
                    description: data.short_description || ''
                };
            });
            setProducts(fetchedProducts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Derive available options from REAL data
    const { brands, categories, minPrice, maxPrice } = useMemo(() => {
        if (loading) return { brands: [], categories: [], minPrice: 0, maxPrice: 1000 };

        const brandsStr = new Set<string>();
        const catsStr = new Set<string>();
        let min = Number.MAX_VALUE;
        let max = 0;

        products.forEach(p => {
            if (p.brand) brandsStr.add(p.brand);
            if (p.category) catsStr.add(p.category);
            if (p.price < min) min = p.price;
            if (p.price > max) max = p.price;
        });

        return {
            brands: Array.from(brandsStr),
            categories: Array.from(catsStr),
            minPrice: min === Number.MAX_VALUE ? 0 : 0, // Keep start at 0
            maxPrice: max === 0 ? 1000 : Math.ceil(max / 100) * 100
        };
    }, [products, loading]);

    // Effect to update filters if URL changes
    React.useEffect(() => {
        if (urlCategory) {
            setFilters(prev => {
                const cat = urlCategory.toLowerCase();
                if (!prev.categories.includes(cat)) {
                    return { ...prev, categories: [cat] };
                }
                return prev;
            });
        }
    }, [urlCategory]);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
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
    }, [products, filters]);

    const activeFiltersCount = filters.categories.length + filters.brands.length + (filters.priceRange[1] < maxPrice ? 1 : 0);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header / Breadcrumbs */}
            <div className="mb-8">
                <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 mb-2 inline-block">&larr; Back to Home</Link>
                <h1 className="text-4xl font-bold tracking-tight">Products {urlCategory ? `- ${urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)}` : ''}</h1>
                <p className="text-gray-500 mt-2">
                    {loading ? 'Loading products...' : `Showing ${filteredProducts.length} results`}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar Filter */}
                <aside className="w-full lg:w-1/4">
                    <Card className="p-4 sticky top-24">
                        <ProductFilter
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            brands={brands}
                            categories={categories}
                            currFilters={filters}
                            setFilters={setFilters}
                        />
                    </Card>
                </aside>

                {/* Right Product Grid */}
                <main className="w-full lg:w-3/4">
                    {/* Active Filters Summary */}
                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {filters.categories.map(cat => (
                                <Badge key={cat} variant="secondary" className="px-3 py-1">
                                    {cat} <span className="ml-2 cursor-pointer" onClick={() => setFilters(p => ({ ...p, categories: p.categories.filter(c => c !== cat) }))}>&times;</span>
                                </Badge>
                            ))}
                            {filters.brands.map(brand => (
                                <Badge key={brand} variant="secondary" className="px-3 py-1">
                                    {brand} <span className="ml-2 cursor-pointer" onClick={() => setFilters(p => ({ ...p, brands: p.brands.filter(b => b !== brand) }))}>&times;</span>
                                </Badge>
                            ))}
                            {filters.priceRange[1] < maxPrice && (
                                <Badge variant="outline" className="px-3 py-1">
                                    Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                                </Badge>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => setFilters({ priceRange: [minPrice, maxPrice], categories: [], brands: [] })}>
                                Clear all
                            </Button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <Link href={`/products/${product.id}`} key={product.id}>
                                    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 h-full bg-white">
                                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {product.price < 1000 && (
                                                <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                                                    Sale
                                                </Badge>
                                            )}
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
                                                <Button size="sm" className="bg-gray-900 text-white hover:bg-blue-600 transition-colors rounded-full px-4">
                                                    View
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
                            <Button variant="outline" onClick={() => setFilters({ priceRange: [minPrice, maxPrice], categories: [], brands: [] })}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
                <ProductGridContent />
            </Suspense>
        </div>
    );
}
