'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CartSheet } from '@/components/store/CartSheet';
import { MegaMenu } from '@/components/store/MegaMenu';
import { SearchBar } from '@/components/store/SearchBar';
import { User, LogOut } from 'lucide-react';
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
            <div className="container flex h-16 items-center mx-auto px-4 gap-4">
                <div className="flex items-center gap-8">
                    <Link className="flex items-center space-x-2" href="/">
                        <span className="font-bold text-xl tracking-tight">LAPTEK</span>
                    </Link>
                    <MegaMenu />
                </div>

                <div className="flex-1 flex items-center justify-center px-4">
                    <SearchBar />
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
                    <CartSheet />
                </nav>
            </div>
        </header>
    );
}
