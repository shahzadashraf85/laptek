'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, MapPin, CreditCard, Settings, Loader2 } from 'lucide-react';
import Header from "@/components/store/Header";

import { Suspense } from 'react';

function ProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');

    useEffect(() => {
        if (!auth || !auth.app) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                router.push('/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />
            <div className="container mx-auto py-10 px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="md:w-64 flex-shrink-0">
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-6 text-center">
                                <div className="h-20 w-20 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-slate-500">
                                    {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                                </div>
                                <h2 className="font-bold text-lg">{user?.displayName || 'Valued Customer'}</h2>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                                <p className="text-xs text-blue-600 mt-2 font-medium">LapTek Member</p>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="bg-white p-1 border shadow-sm">
                                <TabsTrigger value="orders" className="flex gap-2"><Package className="h-4 w-4" /> Orders</TabsTrigger>
                                <TabsTrigger value="addresses" className="flex gap-2"><MapPin className="h-4 w-4" /> Addresses</TabsTrigger>
                                <TabsTrigger value="settings" className="flex gap-2"><Settings className="h-4 w-4" /> Settings</TabsTrigger>
                            </TabsList>

                            <TabsContent value="orders" className="space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight">Order History</h2>
                                {/* Mock Order 1 */}
                                <Card>
                                    <CardHeader className="bg-gray-50/40 pb-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <CardTitle className="text-base">Order #LP-88329</CardTitle>
                                                <CardDescription>Placed on March 15, 2026</CardDescription>
                                            </div>
                                            <Badge className="bg-emerald-500 hover:bg-emerald-600">Delivered</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="flex gap-4 items-center">
                                            <div className="h-16 w-16 bg-gray-100 rounded-md border flex items-center justify-center">
                                                <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=100" className="h-full w-full object-cover rounded-md" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold">MacBook Pro 16" M3 Max</h4>
                                                <p className="text-sm text-gray-500">Space Black • 36GB RAM</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">$3,499.00</p>
                                                <p className="text-xs text-gray-500">Qty: 1</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t bg-gray-50/40 flex justify-between items-center py-3">
                                        <Button variant="link" className="p-0 h-auto font-normal">View Invoice</Button>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Return Item</Button>
                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Buy Again</Button>
                                        </div>
                                    </CardFooter>
                                </Card>

                                {/* Mock Order 2 */}
                                <Card>
                                    <CardHeader className="bg-gray-50/40 pb-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <CardTitle className="text-base">Order #LP-99420</CardTitle>
                                                <CardDescription>Placed on January 2, 2026</CardDescription>
                                            </div>
                                            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Processing</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="flex gap-4 items-center">
                                            <div className="h-16 w-16 bg-gray-100 rounded-md border flex items-center justify-center">
                                                <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=100" className="h-full w-full object-cover rounded-md" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold">Sony WH-1000XM5</h4>
                                                <p className="text-sm text-gray-500">Silver • Noise Cancelling</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">$348.00</p>
                                                <p className="text-xs text-gray-500">Qty: 1</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t bg-gray-50/40 flex justify-between items-center py-3">
                                        <Button variant="link" className="p-0 h-auto font-normal">Track Shipment</Button>
                                        <Button size="sm" variant="secondary" disabled>Cancel Order</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            <TabsContent value="addresses">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Shipping Addresses</CardTitle>
                                        <CardDescription>Manage your delivery locations</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="border rounded-lg p-4 relative bg-blue-50/50 border-blue-200">
                                                <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-700 hover:bg-blue-100">Default</Badge>
                                                <p className="font-bold">{user?.displayName}</p>
                                                <p className="text-sm mt-1">123 Tech Avenue, Suite 100</p>
                                                <p className="text-sm">San Francisco, CA 94107</p>
                                                <p className="text-sm mt-2 text-gray-500">United States</p>
                                                <div className="mt-4 flex gap-2">
                                                    <Button variant="outline" size="sm">Edit</Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
                                                </div>
                                            </div>
                                            <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer min-h-[160px]">
                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                                    <MapPin className="h-5 w-5" />
                                                </div>
                                                <p className="font-medium">Add New Address</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="settings">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Account Settings</CardTitle>
                                        <CardDescription>Update your personal information</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 max-w-md">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Display Name</Label>
                                            <Input id="name" defaultValue={user?.displayName || ''} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" defaultValue={user?.email || ''} disabled />
                                        </div>
                                        <Button>Save Changes</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <ProfileContent />
        </Suspense>
    );
}
