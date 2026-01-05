'use client';

import React from 'react';
import { Zap, TrendingUp, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const DEALS = [
    {
        icon: Zap,
        title: "Flash Sale",
        subtitle: "Up to 40% Off",
        description: "Limited time deals on select laptops",
        color: "from-orange-500 to-red-600",
        link: "/products?category=laptops"
    },
    {
        icon: TrendingUp,
        title: "New Arrivals",
        subtitle: "Latest Tech",
        description: "Be the first to get the newest releases",
        color: "from-blue-500 to-cyan-600",
        link: "/products"
    },
    {
        icon: Package,
        title: "Bundle Deals",
        subtitle: "Save More",
        description: "Complete setups at unbeatable prices",
        color: "from-purple-500 to-pink-600",
        link: "/products?category=accessories"
    }
];

export function DealsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {DEALS.map((deal, index) => (
                        <Link
                            key={index}
                            href={deal.link}
                            className="group relative overflow-hidden rounded-2xl p-8 text-white transition-transform hover:scale-105 duration-300"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${deal.color}`} />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                            <div className="relative z-10">
                                <deal.icon className="w-12 h-12 mb-4 opacity-90" />
                                <h3 className="text-2xl font-bold mb-1">{deal.title}</h3>
                                <p className="text-lg font-semibold mb-2 opacity-90">{deal.subtitle}</p>
                                <p className="text-sm opacity-80 mb-4">{deal.description}</p>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30"
                                >
                                    Shop Now →
                                </Button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
