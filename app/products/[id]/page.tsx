'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from "@/components/store/Header";
import { ALL_PRODUCTS } from '@/lib/products';
import { useCart } from '@/lib/store';
import { ProductReviews } from '@/components/store/ProductReviews';
import { Check, Truck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const product = ALL_PRODUCTS.find(p => p.id === id);
    const addItem = useCart(state => state.addItem);

    if (!product) {
        notFound();
    }

    const relatedProducts = ALL_PRODUCTS
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 3);

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
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <Badge className="absolute top-4 right-4 bg-white/90 text-black backdrop-blur-sm text-lg px-3 py-1">
                                ★ {product.rating}
                            </Badge>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div>
                        <div className="mb-2">
                            <Badge variant="outline" className="mb-2 text-blue-600 border-blue-200 bg-blue-50 capitalize">
                                {product.brand}
                            </Badge>
                            <h1 className="text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
                            <div className="flex items-baseline gap-4 mb-6">
                                <span className="text-4xl font-bold">${product.price.toLocaleString()}</span>
                                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                    <Check className="w-4 h-4" /> In Stock
                                </span>
                            </div>
                        </div>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {product.description || `Experience the power of the new ${product.name}. Featuring ${product.specs}, it's designed to handle everything you throw at it with ease.`}
                        </p>

                        <div className="space-y-6 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                            {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                    <span className="font-medium text-gray-600">{key}</span>
                                    <span className="font-semibold text-gray-900">{value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Button size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700 h-14 text-lg" onClick={() => addItem(product)}>
                                Add to Cart
                            </Button>
                            <Button size="lg" variant="outline" className="flex-1 h-14 text-lg">
                                Buy Now
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-4 rounded-lg bg-gray-50">
                                <Truck className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                <span className="text-sm font-medium">Free Shipping</span>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-50">
                                <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                <span className="text-sm font-medium">2 Year Warranty</span>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-50">
                                <Check className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                <span className="text-sm font-medium">30 Day Return</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="my-16">
                    <ProductReviews productId={id} />
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            You might also like
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedProducts.map(rp => (
                                <Link href={`/products/${rp.id}`} key={rp.id}>
                                    <div className="group border rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white">
                                        <div className="aspect-video bg-gray-100 overflow-hidden relative">
                                            <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold truncate text-lg text-gray-900">{rp.name}</h3>
                                            <p className="text-gray-500 text-sm mb-2">{rp.brand}</p>
                                            <span className="font-bold text-blue-600 text-lg">${rp.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
