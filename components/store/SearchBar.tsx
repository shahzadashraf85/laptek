'use client';

import React, { useState } from 'react';
import { Search, TrendingUp, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ALL_PRODUCTS } from '@/lib/products';

const TRENDING_SEARCHES = ['MacBook Pro', 'Gaming Laptop', 'iPhone 15', 'Wireless Headphones'];
const RECENT_SEARCHES = ['Dell XPS', 'iPad Pro'];

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [results, setResults] = useState<typeof ALL_PRODUCTS>([]);

    const handleSearch = (value: string) => {
        setQuery(value);
        if (value.trim().length > 0) {
            const filtered = ALL_PRODUCTS.filter(p =>
                p.name.toLowerCase().includes(value.toLowerCase()) ||
                p.category.toLowerCase().includes(value.toLowerCase()) ||
                p.brand.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 5);
            setResults(filtered);
        } else {
            setResults([]);
        }
    };

    return (
        <div className="relative w-full max-w-2xl">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search for products, brands, or categories..."
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className="pl-10 pr-4 h-11 w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
            </div>

            {/* Search Dropdown */}
            {isFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-2xl z-50 max-h-[500px] overflow-y-auto">
                    {results.length > 0 ? (
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
                        </div>
                    ) : query.length === 0 ? (
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
                                            onClick={() => handleSearch(term)}
                                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <p className="text-xs font-semibold text-gray-500">RECENT SEARCHES</p>
                                </div>
                                <div className="space-y-1">
                                    {RECENT_SEARCHES.map((term, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSearch(term)}
                                            className="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-sm">No results found for "{query}"</p>
                            <p className="text-xs mt-1">Try searching for something else</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
