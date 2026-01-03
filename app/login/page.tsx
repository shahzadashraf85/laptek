'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential') {
                setError('Invalid email or password. If you haven\'t created an account yet, please Sign Up first.');
            } else if (err.code === 'auth/user-not-found') { // Legacy error code
                setError('Account not found. Please Sign Up.');
            } else {
                setError('Failed to login. Please check your credentials and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (err: any) {
            console.error(err);
            setError('Failed to sign in with Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden shadow-2xl border-none">
                {/* Left Side - Visual */}
                <div className="hidden md:flex flex-col justify-between bg-zinc-900 border-r border-zinc-800 p-10 text-white relative overflow-hidden">

                    <div className="relative z-10">
                        <Link href="/" className="font-bold text-2xl tracking-tighter mb-2 block text-white/90 hover:text-white transition-colors">LAPTEK</Link>
                        <div className="h-1 w-12 bg-blue-500 rounded-full mb-6"></div>
                        <h2 className="text-3xl font-bold leading-tight mb-4">Welcome Back.</h2>
                        <p className="text-zinc-400">Log in to track your orders, manage your wishlist, and access exclusive deals.</p>
                    </div>

                    <div className="relative z-10 mt-12 space-y-4">
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</div>
                            <span>Fast Checkout</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">2</div>
                            <span>Marketplace Sync</span>
                        </div>
                    </div>

                    {/* Abstract Background Element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900">Sign In</h3>
                        <p className="text-gray-500 text-sm mt-1">Enter your details to access your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">{error}</div>}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-10 h-10 border-gray-200 focus-visible:ring-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 h-10 border-gray-200 focus-visible:ring-blue-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button className="w-full bg-zinc-900 hover:bg-black h-11 shadow-lg shadow-zinc-500/20 transition-all font-medium" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium">Or continue with</span></div>
                    </div>

                    <Button variant="outline" type="button" onClick={handleGoogleLogin} className="w-full h-11 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium" disabled={loading}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                        Google
                    </Button>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account? <Link href="/signup" className="text-blue-600 font-semibold hover:underline flex items-center justify-center gap-1 inline-flex">Sign up <ArrowRight className="h-4 w-4" /></Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}
