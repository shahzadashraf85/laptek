'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, getCountFromServer, where } from 'firebase/firestore';
import {
    DollarSign,
    ShoppingCart,
    Users,
    TrendingUp,
    Package,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Clock,
    Loader2
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
}

interface RecentOrder {
    id: string;
    customer: string;
    product: string;
    amount: number;
    status: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                // 1. Get Counts (Efficient)
                const productsCount = await getCountFromServer(query(collection(db, 'products'), where('status', '==', 'active')));
                const usersCount = await getCountFromServer(collection(db, 'users'));
                const ordersCount = await getCountFromServer(collection(db, 'orders'));

                // 2. Calculate Revenue & Get Recent Orders
                // Ideally this should be a cloud function or cached stat document. 
                // For now, we fetch last 50 orders to estimate revenue and get recent list.
                const ordersQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50));
                const ordersSnap = await getDocs(ordersQ);

                let revenue = 0;
                const recent: RecentOrder[] = [];

                ordersSnap.docs.forEach((doc, index) => {
                    const data = doc.data();
                    if (data.status === 'completed' || data.status === 'paid') {
                        revenue += data.pricing?.total || 0;
                    }

                    if (index < 5) {
                        const items = data.items || [];
                        const firstItem = items[0] || { name: 'Unknown' };
                        recent.push({
                            id: data.orderNumber || doc.id.substring(0, 8),
                            customer: data.customerName || 'Guest',
                            product: items.length > 1 ? `${firstItem.name} +${items.length - 1}` : firstItem.name,
                            amount: data.pricing?.total || 0,
                            status: data.status || 'pending'
                        });
                    }
                });

                setStats({
                    totalRevenue: revenue, // Note: This is only last 50 orders revenue for performance
                    totalOrders: ordersCount.data().count,
                    totalUsers: usersCount.data().count,
                    totalProducts: productsCount.data().count
                });
                setRecentOrders(recent);

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your store's performance</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    change={0}
                    icon={<DollarSign className="w-6 h-6 text-white" />}
                    color="bg-blue-600"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders.toString()}
                    change={0}
                    icon={<ShoppingCart className="w-6 h-6 text-white" />}
                    color="bg-purple-600"
                />
                <StatCard
                    title="Active Users"
                    value={stats.totalUsers.toString()}
                    change={0}
                    icon={<Users className="w-6 h-6 text-white" />}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Products"
                    value={stats.totalProducts.toString()}
                    change={0}
                    icon={<Package className="w-6 h-6 text-white" />}
                    color="bg-green-500"
                />
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <Card className="lg:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">Recent Orders</h3>
                        <Button variant="outline" size="sm">View All</Button>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No orders yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500 border-b">
                                        <th className="pb-3 font-medium">Order ID</th>
                                        <th className="pb-3 font-medium">Customer</th>
                                        <th className="pb-3 font-medium">Product</th>
                                        <th className="pb-3 font-medium">Amount</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-4 font-medium text-blue-600">{order.id}</td>
                                            <td className="py-4">{order.customer}</td>
                                            <td className="py-4 text-gray-500">{order.product}</td>
                                            <td className="py-4 font-medium">${order.amount.toLocaleString()}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize 
                                                    ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* Quick Stats / Top Products Placeholder */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4">Store Health</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="font-semibold text-green-900">System Operational</p>
                                    <p className="text-sm text-green-700">All services running smoothly</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-semibold text-blue-900">Sync Status</p>
                                    <p className="text-sm text-blue-700">Database connected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    )
}

function StatCard({ title, value, change, icon, color }: any) {
    return (
        <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${color}`}>
                {icon}
            </div>
        </Card>
    );
}
