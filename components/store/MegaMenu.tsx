'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Laptop, Smartphone, Monitor, Headphones, Keyboard, Mouse, Camera, Watch } from 'lucide-react';

const MEGA_MENU_CATEGORIES = {
    laptops: {
        icon: Laptop,
        title: 'Laptops',
        featured: [
            { name: 'MacBook Pro', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=200&h=200&fit=crop', link: '/products/1' },
            { name: 'Dell XPS', image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=200&h=200&fit=crop', link: '/products/2' }
        ],
        categories: [
            { title: 'By Type', items: ['Gaming Laptops', 'Business Laptops', 'Ultrabooks', '2-in-1 Laptops'] },
            { title: 'By Brand', items: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'MSI'] },
            { title: 'By Price', items: ['Under $500', '$500-$1000', '$1000-$2000', 'Over $2000'] }
        ]
    },
    phones: {
        icon: Smartphone,
        title: 'Phones',
        featured: [
            { name: 'iPhone 15 Pro', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop', link: '/products/3' },
            { name: 'Galaxy S24', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop', link: '/products/6' }
        ],
        categories: [
            { title: 'By Brand', items: ['Apple', 'Samsung', 'Google', 'OnePlus'] },
            { title: 'By Feature', items: ['5G Phones', 'Foldable', 'Camera Phones', 'Gaming Phones'] },
            { title: 'Accessories', items: ['Cases', 'Screen Protectors', 'Chargers', 'Wireless Earbuds'] }
        ]
    },
    desktops: {
        icon: Monitor,
        title: 'Desktops',
        featured: [
            { name: 'Gaming PC', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&h=200&fit=crop', link: '/products/5' }
        ],
        categories: [
            { title: 'By Type', items: ['Gaming PCs', 'Workstations', 'All-in-One', 'Mini PCs'] },
            { title: 'Components', items: ['Graphics Cards', 'Processors', 'RAM', 'Storage'] },
            { title: 'Brands', items: ['Alienware', 'HP Omen', 'Custom Built', 'Dell'] }
        ]
    },
    accessories: {
        icon: Headphones,
        title: 'Accessories',
        featured: [
            { name: 'Sony WH-1000XM5', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop', link: '/products/4' }
        ],
        categories: [
            { title: 'Audio', items: ['Headphones', 'Earbuds', 'Speakers', 'Microphones'] },
            { title: 'Input Devices', items: ['Keyboards', 'Mice', 'Webcams', 'Drawing Tablets'] },
            { title: 'Storage', items: ['External SSDs', 'USB Drives', 'Memory Cards', 'NAS'] }
        ]
    }
};

export function MegaMenu() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    return (
        <nav className="hidden lg:flex items-center space-x-1 relative">
            {Object.entries(MEGA_MENU_CATEGORIES).map(([key, data]) => (
                <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => setActiveMenu(key)}
                    onMouseLeave={() => setActiveMenu(null)}
                >
                    <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium hover:text-blue-600 transition-colors">
                        <data.icon className="w-4 h-4" />
                        {data.title}
                        <ChevronDown className="w-3 h-3" />
                    </button>

                    {activeMenu === key && (
                        <div className="absolute top-full left-0 w-screen max-w-5xl bg-white shadow-2xl border-t-2 border-blue-600 rounded-b-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-8">
                                <div className="grid grid-cols-4 gap-8">
                                    {/* Featured Products */}
                                    <div className="col-span-1 border-r pr-6">
                                        <h3 className="font-bold text-sm mb-4 text-gray-900">Featured</h3>
                                        <div className="space-y-4">
                                            {data.featured.map((product, i) => (
                                                <Link
                                                    key={i}
                                                    href={product.link}
                                                    className="block group"
                                                >
                                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <p className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                                                        {product.name}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    {data.categories.map((category, i) => (
                                        <div key={i}>
                                            <h3 className="font-bold text-sm mb-4 text-gray-900">{category.title}</h3>
                                            <ul className="space-y-2">
                                                {category.items.map((item, j) => (
                                                    <li key={j}>
                                                        <Link
                                                            href={`/products?category=${key}`}
                                                            className="text-sm text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block"
                                                        >
                                                            {item}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom CTA */}
                                <div className="mt-6 pt-6 border-t">
                                    <Link
                                        href={`/products?category=${key}`}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2"
                                    >
                                        View All {data.title} →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
}
