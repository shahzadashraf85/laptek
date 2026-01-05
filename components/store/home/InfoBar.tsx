import React from 'react';
import { Truck, ShieldCheck, Headphones, CreditCard } from 'lucide-react';

const FEATURES = [
    {
        icon: Truck,
        title: "Free Shipping",
        desc: "On all orders over $150"
    },
    {
        icon: ShieldCheck,
        title: "Secure Payment",
        desc: "100% secure payment"
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        desc: "Dedicated support"
    },
    {
        icon: CreditCard,
        title: "Money Back",
        desc: "30 day return guarantee"
    }
];

export function InfoBar() {
    return (
        <section className="bg-white border-y border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <f.icon className="w-8 h-8 text-blue-600 mb-3" />
                            <h3 className="font-semibold text-gray-900">{f.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
