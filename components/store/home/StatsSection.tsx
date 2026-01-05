'use client';

import React from 'react';
import { Award, Shield, Sparkles, Rocket } from 'lucide-react';

const STATS = [
    {
        icon: Award,
        value: "12K+",
        label: "Happy Customers",
        color: "text-blue-600"
    },
    {
        icon: Shield,
        value: "99.9%",
        label: "Satisfaction Rate",
        color: "text-green-600"
    },
    {
        icon: Sparkles,
        value: "500+",
        label: "Premium Products",
        color: "text-purple-600"
    },
    {
        icon: Rocket,
        value: "24/7",
        label: "Customer Support",
        color: "text-orange-600"
    }
];

export function StatsSection() {
    return (
        <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center group"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                {stat.value}
                            </div>
                            <div className="text-gray-400 text-sm font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
