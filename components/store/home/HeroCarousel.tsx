'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SLIDES = [
    {
        id: 1,
        title: "The New MacBook Pro",
        subtitle: "Mind-blowing. Head-turning.",
        description: "Supercharged by M3 Max. The most powerful laptop we've ever built.",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=2000",
        cta: "Buy Now",
        link: "/products/1",
        color: "from-purple-900 to-indigo-900"
    },
    {
        id: 2,
        title: "Samsung Galaxy S24 Ultra",
        subtitle: "Galaxy AI is here",
        description: "Unleash new levels of creativity with the most powerful Galaxy AI yet.",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=2000",
        cta: "Shop Galaxy",
        link: "/products/6",
        color: "from-amber-700 to-orange-900"
    },
    {
        id: 3,
        title: "Gaming Revolution",
        subtitle: "RTX 4090 Power",
        description: "Experience ray tracing like never before with our custom built rigs.",
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=2000",
        cta: "Build Yours",
        link: "/products/5",
        color: "from-blue-900 to-cyan-900"
    }
];

export function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[600px] w-full overflow-hidden bg-black text-white">
            {SLIDES.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="h-full w-full object-cover"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-80 mix-blend-multiply`} />
                        <div className="absolute inset-0 bg-black/30" />
                    </div>

                    {/* Content */}
                    <div className="relative container mx-auto h-full px-4 flex flex-col justify-center">
                        <div className="max-w-2xl space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-700">
                            <span className="inline-block px-3 py-1 rounded-full border border-white/30 text-sm font-medium backdrop-blur-sm">
                                {slide.subtitle}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                                {slide.title}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-lg">
                                {slide.description}
                            </p>
                            <div className="pt-4">
                                <Button size="lg" className="bg-white text-black hover:bg-gray-100 h-12 px-8 text-base" asChild>
                                    <Link href={slide.link}>
                                        {slide.cta} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === current ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
