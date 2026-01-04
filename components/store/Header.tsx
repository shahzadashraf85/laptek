'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
    const [user, setUser] = useState<FirebaseUser | null>(null);

    useEffect(() => {
        if (!auth || !auth.app) return;
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center mx-auto px-4">
                <div className="mr-4 hidden md:flex">
                    <Link className="mr-6 flex items-center space-x-2" href="/">
                        <span className="hidden font-bold sm:inline-block text-xl tracking-tight">LAPTEK</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/products?category=laptops" className="hover:text-blue-600 transition-colors">Laptops</Link>
                        <Link href="/products?category=desktops" className="hover:text-blue-600 transition-colors">Desktops</Link>
                        <Link href="/products?category=phones" className="hover:text-blue-600 transition-colors">Phones</Link>
                        <Link href="/products?category=accessories" className="hover:text-blue-600 transition-colors">Accessories</Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search could go here */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                                        <div className="flexh-8 w-8 items-center justify-center rounded-full bg-slate-200">
                                            <User className="h-4 w-4" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">My Account</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile?tab=orders">Order History</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => auth.signOut()}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="ghost" asChild className="hidden sm:inline-flex">
                                <Link href="/login">Login</Link>
                            </Button>
                        )}

                        <Button variant="ghost" asChild className="hidden sm:inline-flex">
                            <Link href="/admin">Admin</Link>
                        </Button>
                        <Button size="icon" variant="ghost">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Cart</span>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
