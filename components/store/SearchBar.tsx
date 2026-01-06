'use client';

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, getDocs, orderBy, startAt, endAt } from 'firebase/firestore';

const TRENDING_SEARCHES = ['MacBook Pro', 'Gaming Laptop', 'iPhone 15', 'Wireless Headphones'];
const RECENT_SEARCHES = ['Dell XPS', 'iPad Pro'];

interface SearchResult {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
}

export function SearchBar() {
    const router = useRouter();
    const [queryText, setQueryText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (queryText.trim().length > 1) { // Only search if > 1 char
                searchProducts(queryText);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [queryText]);

    async function searchProducts(text: string) {
        setLoading(true);
        try {
            // Note: Firestore native search is limited. 
            // We'll use a simple case-sensitive prefix match on 'title' for now.
            // For production, integrate Algolia or Typesense.

            // To make it slightly better, we can assume titles are Capitalized in DB or just try.
            // Actually, simpler is to just fetch recent items and filter client side if the dataset is small, 
            // BUT we want to be scalable.
            // Let's rely on the prefix match for now assuming standard naming.

            // Capitalize first letter basic attempt
            const searchTerm = text.charAt(0).toUpperCase() + text.slice(1);

            const q = query(
                collection(db, 'products'),
                orderBy('title'),
                startAt(searchTerm),
                endAt(searchTerm + '\uf8ff'),
                limit(5)
            );

            const snapshot = await getDocs(q);
            const hits = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.title || 'Untitled',
                    category: (data.category_code?.split('/')[1] || 'Uncategorized'),
                    price: data.offer?.price || 0,
                    image: data.main_image_url || 'https://placehold.co/100'
                };
            });

            setResults(hits);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            router.push(`/products?search=${encodeURIComponent(queryText)}`);
            setIsFocused(false);
        }
    };

    return (
        <div className="relative w-full max-w-2xl">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search for products, brands, or categories..."
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    // Delay blur to allow clicking on results
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className="pl-10 pr-4 h-11 w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />}
            </div>

            {/* Search Dropdown */}
            {isFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-2xl z-50 max-h-[500px] overflow-y-auto">
                    {queryText.length > 1 ? (
                        results.length > 0 ? (
                            <div className="p-2">
                                <p className="text-xs font-semibold text-gray-500 px-3 py-2">PRODUCTS</p>
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded-md bg-gray-100"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.category}</p>
                                        </div>
                                        <span className="font-bold text-blue-600">${product.price}</span>
                                    </Link>
                                ))}
                                <Link href={`/products?search=${encodeURIComponent(queryText)}`} className="block text-center p-3 text-blue-600 font-medium hover:bg-gray-50 text-sm">
                                    View all results
                                </Link>
                            </div>
                        ) : (
                            !loading && (
                                <div className="p-8 text-center text-gray-500">
                                    <p className="text-sm">No results found for "{queryText}"</p>
                                    <p className="text-xs mt-1">Try another keyword</p>
                                </div>
                            )
                        )
                    ) : (
                        <div className="p-4">
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="w-4 h-4 text-orange-500" />
                                    <p className="text-xs font-semibold text-gray-500">TRENDING SEARCHES</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {TRENDING_SEARCHES.map((term, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setQueryText(term)}
                                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
