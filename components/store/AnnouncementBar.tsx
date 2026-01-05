'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-2 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

            <div className="container mx-auto flex items-center justify-between relative z-10">
                <div className="flex-1 text-center">
                    <p className="text-sm font-medium">
                        🎉 <span className="font-bold">New Year Sale:</span> Up to 40% off on select items + Free Shipping on orders over $150
                        <a href="/products" className="ml-2 underline hover:no-underline font-semibold">
                            Shop Now →
                        </a>
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="ml-4 hover:bg-white/20 p-1 rounded transition-colors"
                    aria-label="Close announcement"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
