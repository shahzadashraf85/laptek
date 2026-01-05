'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Software Engineer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        text: "The MacBook Pro I ordered arrived in perfect condition. The customer service was exceptional, and the price was unbeatable. Highly recommend!"
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Content Creator",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        text: "Best tech store I've ever used. Fast shipping, authentic products, and amazing deals. My gaming rig is a beast thanks to LapTek!"
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Graphic Designer",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
        rating: 5,
        text: "I was skeptical about ordering online, but LapTek exceeded all expectations. The iPad Pro is perfect for my design work."
    }
];

export function Testimonials() {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who trust LapTek for their tech needs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 relative"
                        >
                            <Quote className="absolute top-6 right-6 w-12 h-12 text-blue-100" />

                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                                />
                                <div>
                                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>

                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-gray-600 leading-relaxed italic">
                                "{testimonial.text}"
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <div className="inline-flex items-center gap-8 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">4.9/5</span>
                            <span>Average Rating</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300" />
                        <div>
                            <span className="font-semibold">12,000+</span>
                            <span className="ml-1">Happy Customers</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
