'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Header from "@/components/store/Header";
import { useCart } from '@/lib/store';
import { ProductReviews } from '@/components/store/ProductReviews';
import { Check, Truck, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';

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
    specifications: Record<string, string>;
    sku?: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const addItem = useCart(state => state.addItem);

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            try {
                // Fetch Main Product
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                const data = docSnap.data();
                const currentProduct: Product = {
                    id: docSnap.id,
                    name: typeof data.title === 'object' ? (data.title?.en || String(data.title)) : (data.title || 'Untitled'),
                    category: (data.category_code?.split('/')[1] || data.category_code || 'Uncategorized').toLowerCase(),
                    price: data.offer?.price || 0,
                    image: data.main_image_url || 'https://placehold.co/600',
                    specs: Object.entries(data.specifications || {}).map(([k, v]) => `${v}`).join(', '),
                    rating: data.stats?.rating || 0,
                    brand: typeof data.brand === 'object' ? (data.brand?.en || String(data.brand)) : (data.brand || 'Generic'),
                    description: typeof data.short_description === 'object' ? (data.short_description?.en || String(data.short_description)) : (data.short_description || ''),
                    specifications: data.specifications || {},
                    sku: data.offer?.sku
                };

                setProduct(currentProduct);

                // Fetch Related Products (Same category, exclude current)
                const q = query(
                    collection(db, 'products'),
                    where('category_code', '==', data.category_code),
                    limit(4)
                );

                const relatedSnap = await getDocs(q);
                const related = relatedSnap.docs
                    .filter(d => d.id !== id)
                    .map(d => {
                        const rd = d.data();
                        return {
                            id: d.id,
                            name: typeof rd.title === 'object' ? (rd.title?.en || String(rd.title)) : (rd.title || 'Untitled'),
                            category: (rd.category_code?.split('/')[1] || rd.category_code || '').toLowerCase(),
                            price: rd.offer?.price || 0,
                            image: rd.main_image_url || 'https://placehold.co/400',
                            specs: '',
                            rating: rd.stats?.rating || 0,
                            brand: typeof rd.brand === 'object' ? (rd.brand?.en || String(rd.brand)) : (rd.brand || ''),
                            description: '',
                            specifications: {}
                        } as Product;
                    })
                    .slice(0, 3);

                setRelatedProducts(related);

            } catch (err) {
                console.error("Error fetching product:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !product) {
        notFound(); // This will trigger Next.js not-found page
        return null;
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/products" className="hover:text-blue-600">Products</Link>
                        <span className="mx-2">/</span>
                        <Link href={`/products?category=${product.category}`} className="hover:text-blue-600 capitalize">{product.category}</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium truncate">{product.name}</span>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {product.price < 500 && (
                                <Badge className="absolute top-4 left-4 h-8 px-3 bg-red-500">Sale</Badge>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline" className="uppercase tracking-wider">
                                {product.brand}
                            </Badge>
                            <div className="flex items-center text-yellow-400 text-sm">
                                {'★'.repeat(Math.round(product.rating))}
                                <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating))}</span>
                                <span className="text-gray-500 ml-2 text-xs">(128 reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <p className="text-lg text-gray-500 mb-6 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="text-4xl font-bold text-gray-900 mb-8">
                            ${product.price ? product.price.toLocaleString() : 'N/A'}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Button
                                className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                                onClick={() => addItem({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.image
                                })}
                            >
                                Add to Cart
                            </Button>
                            <Button variant="outline" className="h-14 px-8 border-2">
                                Save for Later
                            </Button>
                        </div>

                        {/* Features / Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pt-8 border-t">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium">In Stock</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium">Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium">2 Year Warranty</span>
                            </div>
                        </div>

                        {/* Tech Specs */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Technical Specifications</h3>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <div key={key} className="flex justify-between py-2 border-b last:border-0 border-gray-200">
                                        <span className="text-gray-500">{key.replace(/_/g, ' ')}</span>
                                        <span className="font-medium text-gray-900">{String(value)}</span>
                                    </div>
                                ))}
                                {product.sku && (
                                    <div className="flex justify-between py-2 border-b last:border-0 border-gray-200">
                                        <span className="text-gray-500">SKU</span>
                                        <span className="font-medium text-gray-900">{product.sku}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedProducts.map((p) => (
                                <Link href={`/products/${p.id}`} key={p.id}>
                                    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 h-full bg-white">
                                        <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                                            <p className="text-blue-600 font-bold">${p.price.toLocaleString()}</p>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                <ProductReviews productId={product.id} />

            </main>
        </div>
    );
}
