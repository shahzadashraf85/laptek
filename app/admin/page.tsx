'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
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
    Clock
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const salesData = [
    { name: 'Mon', sales: 4000, orders: 24 },
    { name: 'Tue', sales: 3000, orders: 18 },
    { name: 'Wed', sales: 5000, orders: 32 },
    { name: 'Thu', sales: 2780, orders: 20 },
    { name: 'Fri', sales: 6890, orders: 45 },
    { name: 'Sat', sales: 8390, orders: 52 },
    { name: 'Sun', sales: 7490, orders: 48 },
];

const categoryData = [
    { name: 'Laptops', value: 45, color: '#3b82f6' },
    { name: 'Phones', value: 30, color: '#8b5cf6' },
    { name: 'Desktops', value: 15, color: '#10b981' },
    { name: 'Accessories', value: 10, color: '#f59e0b' },
];

const topProducts = [
    { name: 'MacBook Pro 16"', sales: 145, revenue: 507855, trend: 12 },
    { name: 'iPhone 15 Pro Max', sales: 98, revenue: 117402, trend: 8 },
    { name: 'Dell XPS 13', sales: 76, revenue: 113924, trend: -3 },
    { name: 'Gaming Desktop RTX 4090', sales: 34, revenue: 153000, trend: 15 },
];

const recentOrders = [
    { id: '#ORD-2024-001', customer: 'John Doe', product: 'MacBook Pro', amount: 3499, status: 'completed' },
    { id: '#ORD-2024-002', customer: 'Jane Smith', product: 'iPhone 15', amount: 1199, status: 'processing' },
    { id: '#ORD-2024-003', customer: 'Bob Johnson', product: 'Dell XPS', amount: 1499, status: 'pending' },
    { id: '#ORD-2024-004', customer: 'Alice Brown', product: 'iPad Pro', amount: 1099, status: 'completed' },
];

type StatCardProps = {
    title: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: string;
};

function StatCard({ title, value, change, icon, color }: StatCardProps) {
    const isPositive = change >= 0;

    return (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold">{value}</h3>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span className="font-medium">{Math.abs(change)}%</span>
                        <span className="text-gray-500">vs last week</span>
                    </div>
                </div>
                <div className={`p-4 rounded-2xl ${color}`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
}

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="$892,453"
                    change={12.5}
                    icon={<DollarSign className="w-6 h-6 text-white" />}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Total Orders"
                    value="1,247"
                    change={8.2}
                    icon={<ShoppingCart className="w-6 h-6 text-white" />}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <StatCard
                    title="Active Users"
                    value="12,458"
                    change={-2.4}
                    icon={<Users className="w-6 h-6 text-white" />}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <StatCard
                    title="Products"
                    value="487"
                    change={5.1}
                    icon={<Package className="w-6 h-6 text-white" />}
                    color="bg-gradient-to-br from-orange-500 to-orange-600"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Revenue Overview</h3>
                            <p className="text-sm text-gray-500">Last 7 days performance</p>
                        </div>
                        <select className="px-3 py-2 border rounded-lg text-sm">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={salesData}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="sales"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fill="url(#colorSales)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* Category Distribution */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-6">Sales by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {categoryData.map((cat, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                    <span>{cat.name}</span>
                                </div>
                                <span className="font-semibold">{cat.value}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Top Products & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-6">Top Selling Products</h3>
                    <div className="space-y-4">
                        {topProducts.map((product, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex-1">
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-sm text-gray-500">{product.sales} units sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-600">${product.revenue.toLocaleString()}</p>
                                    <div className={`flex items-center gap-1 text-sm ${product.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        <span>{Math.abs(product.trend)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Orders */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-6">Recent Orders</h3>
                    <div className="space-y-4">
                        {recentOrders.map((order, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 transition-colors">
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{order.id}</p>
                                    <p className="text-sm text-gray-500">{order.customer} • {order.product}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">${order.amount}</p>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
                        <Package className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm font-medium">Add Product</p>
                    </button>
                    <button className="p-4 border-2 border-dashed rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center">
                        <Eye className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                        <p className="text-sm font-medium">View Orders</p>
                    </button>
                    <button className="p-4 border-2 border-dashed rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center">
                        <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
                        <p className="text-sm font-medium">Manage Users</p>
                    </button>
                    <button className="p-4 border-2 border-dashed rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center">
                        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                        <p className="text-sm font-medium">View Reports</p>
                    </button>
                </div>
            </Card>
        </div>
    );
}
