'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

export function Newsletter() {
    return (
        <section className="py-24 bg-zinc-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 mb-4">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        Subscribe to our newsletter
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Get the latest updates on new products, upcoming sales, and exclusive offers delivered straight to your inbox.
                    </p>

                    <form className="max-w-md mx-auto flex gap-2" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-white/10 border-white/10 text-white placeholder:text-zinc-500 h-12"
                        />
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
                            Subscribe
                        </Button>
                    </form>
                    <p className="text-xs text-zinc-500">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    );
}
