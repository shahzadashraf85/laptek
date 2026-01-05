import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
    {
        name: 'Laptops',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
        count: '120+ Products',
        link: '/products?category=laptops',
        size: 'col-span-1 md:col-span-2 row-span-2'
    },
    {
        name: 'Phones',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
        count: '80+ Products',
        link: '/products?category=phones',
        size: 'col-span-1 row-span-1'
    },
    {
        name: 'Accessories',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800',
        count: '200+ Products',
        link: '/products?category=accessories',
        size: 'col-span-1 row-span-1'
    },
    {
        name: 'Desktops',
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800',
        count: '45+ Products',
        link: '/products?category=desktops',
        size: 'col-span-1 md:col-span-2 row-span-1'
    }
];

export function CategoryGrid() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Shop by Category</h2>
                        <p className="text-gray-500">Explore our wide range of premium gear</p>
                    </div>
                    <Link href="/products" className="hidden md:flex items-center text-blue-600 font-medium hover:text-blue-700">
                        View All Categories <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
                    {CATEGORIES.map((cat, i) => (
                        <Link
                            key={i}
                            href={cat.link}
                            className={`relative group overflow-hidden rounded-2xl ${cat.size}`}
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors" />
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                                <p className="text-white/80 text-sm mb-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    {cat.count}
                                </p>
                                <span className="inline-flex items-center text-sm font-medium border-b border-white pb-0.5">
                                    Shop Now
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
