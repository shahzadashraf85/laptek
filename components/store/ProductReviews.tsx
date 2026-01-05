'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star, ThumbsUp, User } from 'lucide-react';
import { auth } from '@/lib/firebase'; // Assuming we can use auth later
import { onAuthStateChanged } from 'firebase/auth';

type Review = {
    id: string;
    user: string;
    rating: number;
    date: string;
    content: string;
    likes: number;
};

// Mock initial reviews
const INITIAL_REVIEWS: Review[] = [
    {
        id: '1',
        user: 'Alex M.',
        rating: 5,
        date: '2 months ago',
        content: 'Absolutely loving this device! The performance is incredible and the build quality is top-notch.',
        likes: 12
    },
    {
        id: '2',
        user: 'Sarah K.',
        rating: 4,
        date: '1 month ago',
        content: 'Great product, but the battery life could be slightly better. Otherwise perfect.',
        likes: 5
    }
];

export function ProductReviews({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReview.trim()) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            const review: Review = {
                id: Date.now().toString(),
                user: 'You', // In real app, get from auth
                rating,
                date: 'Just now',
                content: newReview,
                likes: 0
            };
            setReviews([review, ...reviews]);
            setNewReview('');
            setIsSubmitting(false);
        }, 800);
    };

    return (
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-12">
            <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Summary Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl text-center">
                        <div className="text-5xl font-bold text-gray-900 mb-2">4.8</div>
                        <div className="flex justify-center gap-1 text-yellow-500 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-5 h-5 fill-current" />
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm">Based on {reviews.length} reviews</p>
                    </div>

                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((r) => (
                            <div key={r} className="flex items-center gap-2 text-sm">
                                <span className="w-3">{r}</span>
                                <Star className="w-3 h-3 text-gray-400" />
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{ width: r === 5 ? '70%' : r === 4 ? '20%' : '5%' }}
                                    />
                                </div>
                                <span className="text-gray-400 w-8 text-right">{r === 5 ? '70%' : r === 4 ? '20%' : '5%'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews List & Form */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Add Review Form */}
                    <Card className="p-6 border-dashed border-2">
                        <h3 className="font-semibold mb-4">Write a Review</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium">Rating:</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-2xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Textarea
                                placeholder="Share your thoughts about this product..."
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                className="min-h-[100px]"
                                required
                            />
                            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                                {isSubmitting ? 'Posting...' : 'Post Review'}
                            </Button>
                        </form>
                    </Card>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {review.user.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{review.user}</p>
                                            <p className="text-xs text-gray-500">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                    {review.content}
                                </p>
                                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                                    <ThumbsUp className="w-3 h-3" />
                                    Helpful ({review.likes})
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
