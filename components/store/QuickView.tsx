'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { useCart } from '@/lib/store';
import { useWishlist } from '@/lib/wishlist';
import toast from 'react-hot-toast';
import Link from 'next/link';

type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    brand: string;
    rating: number;
    specs: string;
    description?: string;
};

type QuickViewProps = {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
};

export function QuickView({ product, isOpen, onClose }: QuickViewProps) {
    const addToCart = useCart(state => state.addItem);
    const { addItem: addToWishlist, isInWishlist } = useWishlist();

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    const handleAddToWishlist = () => {
        if (!isInWishlist(product.id)) {
            addToWishlist(product);
            toast.success('Added to wishlist!');
        } else {
            toast('Already in wishlist');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: `Check out ${product.name} on LapTek`,
                url: `/products/${product.id}`,
            });
        } else {
            navigator.clipboard.writeText(window.location.origin + `/products/${product.id}`);
            toast.success('Link copied to clipboard!');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image */}
                    <div className="relative aspect-square bg-gray-100">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-4 right-4 bg-white/90 text-black">
                            ★ {product.rating}
                        </Badge>
                    </div>

                    {/* Details */}
                    <div className="p-8 flex flex-col">
                        <div className="flex-1">
                            <Badge variant="outline" className="mb-3 text-blue-600 border-blue-200 bg-blue-50 capitalize">
                                {product.brand}
                            </Badge>
                            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                            <p className="text-gray-500 text-sm mb-4">{product.category}</p>

                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
                                <span className="text-green-600 text-sm font-medium">In Stock</span>
                            </div>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {product.description || product.specs}
                            </p>

                            <div className="flex gap-2 mb-6">
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleAddToWishlist}
                                    className={isInWishlist(product.id) ? 'text-red-500 border-red-500' : ''}
                                >
                                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleShare}
                                >
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <Link
                                href={`/products/${product.id}`}
                                className="text-sm text-blue-600 hover:underline"
                                onClick={onClose}
                            >
                                View full details →
                            </Link>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
