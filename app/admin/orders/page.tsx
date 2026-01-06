'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import {
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Package,
    DollarSign,
    TrendingUp,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
    id: string; // Document ID
    orderNumber: string; // Readable ID e.g. ORD-001
    customer: string;
    email: string;
    product: string; // Summary of main product or first item
    amount: number;
    status: string;
    date: Date;
    itemsCount: number;
}

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedOrders = snapshot.docs.map(doc => {
                const data = doc.data();
                const items = data.items || [];
                const firstItem = items.length > 0 ? items[0] : { name: 'Unknown Item' };
                const productSummary = items.length > 1 ? `${firstItem.name} + ${items.length - 1} more` : firstItem.name;

                return {
                    id: doc.id,
                    orderNumber: data.orderNumber || doc.id.substring(0, 8),
                    customer: data.customerName || 'Guest',
                    email: data.customerEmail || 'No Email',
                    product: productSummary,
                    amount: data.pricing?.total || 0,
                    status: data.status || 'pending',
                    date: data.createdAt?.toDate() || new Date(),
                    itemsCount: items.length
                };
            });
            setOrders(fetchedOrders);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const config: any = {
            completed: { icon: CheckCircle, className: 'bg-green-100 text-green-700', label: 'Completed' },
            processing: { icon: Clock, className: 'bg-blue-100 text-blue-700', label: 'Processing' },
            pending: { icon: Clock, className: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
            cancelled: { icon: XCircle, className: 'bg-red-100 text-red-700', label: 'Cancelled' },
        }[status] || { icon: Clock, className: 'bg-gray-100 text-gray-700', label: status };

        const Icon = config.icon;
        return (
            <Badge className={`${config.className} hover:${config.className} flex items-center gap-1 w-fit`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    // Calculate real-time stats from fetched orders
    const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0);
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-gray-500 mt-1">Manage and track customer orders</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold mt-1">{orders.length}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-600" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Completed</p>
                            <p className="text-2xl font-bold mt-1 text-green-600">{completedOrders}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold mt-1 text-yellow-600">{pendingOrders}</p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Revenue</p>
                            <p className="text-2xl font-bold mt-1 text-blue-600">${totalRevenue.toLocaleString()}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-blue-600" />
                    </div>
                </Card>
            </div>

            {/* Filters & Search */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search orders by ID, customer, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        More Filters
                    </Button>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </Card>

            {/* Orders Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-blue-600">{order.orderNumber}</div>
                                            <div className="text-xs text-gray-500">{order.itemsCount} item(s)</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.customer}</div>
                                            <div className="text-sm text-gray-500">{order.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[200px]" title={order.product}>{order.product}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{order.date.toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm font-semibold">${order.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simplified for now) */}
                <div className="px-6 py-4 border-t flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {filteredOrders.length} orders
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
