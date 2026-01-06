'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, MapPin, CreditCard, Settings, Loader2 } from 'lucide-react';
import Header from "@/components/store/Header";

interface Order {
    id: string;
    orderNumber: string;
    createdAt: any;
    status: string;
    total: number;
    items: any[];
}

function ProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');

    useEffect(() => {
        // ... unchanged logic ...
        // Copying full logic from previous step
        if (!auth || !auth.app) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchOrders(currentUser.uid);
            } else {
                router.push('/login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    const fetchOrders = async (userId: string) => {
        setOrdersLoading(true);
        try {
            const q = query(
                collection(db, 'orders'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const fetchedOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                orderNumber: doc.data().orderNumber || doc.id.substring(0, 8),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                status: doc.data().status || 'pending',
                total: doc.data().pricing?.total || 0,
                items: doc.data().items || []
            }));

            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setOrdersLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Header />
            <div className="container mx-auto py-10 px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="md:w-64 flex-shrink-0">
                        <Card className="border-none shadow-sm sticky top-24">
                            <CardContent className="p-6 text-center">
                                <div className="h-20 w-20 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-slate-500 overflow-hidden">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.displayName?.charAt(0) || user?.email?.charAt(0)
                                    )}
                                </div>
                                <h2 className="font-bold text-lg">{user?.displayName || 'Valued Customer'}</h2>
                                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                                <p className="text-xs text-blue-600 mt-2 font-medium">LapTek Member</p>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="bg-white p-1 border shadow-sm w-full md:w-auto overflow-x-auto">
                                <TabsTrigger value="orders" className="flex gap-2"><Package className="h-4 w-4" /> Orders</TabsTrigger>
                                <TabsTrigger value="addresses" className="flex gap-2"><MapPin className="h-4 w-4" /> Addresses</TabsTrigger>
                                <TabsTrigger value="settings" className="flex gap-2"><Settings className="h-4 w-4" /> Settings</TabsTrigger>
                            </TabsList>

                            <TabsContent value="orders" className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold tracking-tight">Order History</h2>
                                    {ordersLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-500" />}
                                </div>

                                {!ordersLoading && orders.length === 0 && (
                                    <Card className="p-8 text-center text-gray-500">
                                        You haven't placed any orders yet.
                                        <div className="mt-4">
                                            <Button onClick={() => router.push('/products')}>Start Shopping</Button>
                                        </div>
                                    </Card>
                                )}

                                {orders.map((order) => (
                                    <Card key={order.id}>
                                        <CardHeader className="bg-gray-50/40 pb-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <CardTitle className="text-base">Order #{order.orderNumber}</CardTitle>
                                                    <CardDescription>Placed on {order.createdAt.toLocaleDateString()}</CardDescription>
                                                </div>
                                                <Badge className={`capitalize ${order.status === 'delivered' ? 'bg-emerald-500 hover:bg-emerald-600' :
                                                        order.status === 'cancelled' ? 'bg-red-500 hover:bg-red-600' :
                                                            'bg-blue-500 hover:bg-blue-600'
                                                    }`}>
                                                    {order.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-4">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex gap-4 items-center">
                                                    <div className="h-16 w-16 bg-gray-100 rounded-md border flex items-center justify-center overflow-hidden">
                                                        <img
                                                            src={item.image || 'https://placehold.co/100'}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold line-clamp-1">{item.name}</h4>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                        <CardFooter className="border-t bg-gray-50/40 flex justify-between items-center py-3">
                                            <div className="font-bold">Total: ${order.total.toLocaleString()}</div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">Details</Button>
                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Buy Again</Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="addresses">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Shipping Addresses</CardTitle>
                                        <CardDescription>Manage your delivery locations</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-gray-500 text-sm">No addresses saved yet.</p>
                                        <Button variant="outline"><MapPin className="w-4 h-4 mr-2" /> Add New Address</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="settings">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Account Settings</CardTitle>
                                        <CardDescription>Manage your profile and preferences</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" value={user?.email || ''} disabled />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Display Name</Label>
                                            <Input id="name" defaultValue={user?.displayName || ''} />
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
