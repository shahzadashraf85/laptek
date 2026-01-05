'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    Package,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

const MOCK_PRODUCTS = [
    { id: 1, name: 'MacBook Pro 16" M3 Max', category: 'Laptops', price: 3499, stock: 45, status: 'active', sales: 145 },
    { id: 2, name: 'Dell XPS 13 Plus', category: 'Laptops', price: 1499, stock: 23, status: 'active', sales: 76 },
    { id: 3, name: 'iPhone 15 Pro Max', category: 'Phones', price: 1199, stock: 0, status: 'out_of_stock', sales: 98 },
    { id: 4, name: 'Sony WH-1000XM5', category: 'Accessories', price: 348, stock: 156, status: 'active', sales: 234 },
    { id: 5, name: 'Gaming Desktop RTX 4090', category: 'Desktops', price: 4500, stock: 8, status: 'low_stock', sales: 34 },
    { id: 6, name: 'Samsung Galaxy S24 Ultra', category: 'Phones', price: 1299, stock: 67, status: 'active', sales: 89 },
    { id: 7, name: 'iPad Pro 12.9"', category: 'Tablets', price: 1099, stock: 34, status: 'active', sales: 56 },
];

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredProducts = MOCK_PRODUCTS.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
            case 'out_of_stock':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Out of Stock</Badge>;
            case 'low_stock':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Low Stock</Badge>;
            default:
                return <Badge>Unknown</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your product inventory</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/admin/products/new">
                        <Package className="w-4 h-4 mr-2" />
                        Add New Product
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold mt-1">{MOCK_PRODUCTS.length}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-600" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active</p>
                            <p className="text-2xl font-bold mt-1 text-green-600">
                                {MOCK_PRODUCTS.filter(p => p.status === 'active').length}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Low Stock</p>
                            <p className="text-2xl font-bold mt-1 text-yellow-600">
                                {MOCK_PRODUCTS.filter(p => p.status === 'low_stock').length}
                            </p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Out of Stock</p>
                            <p className="text-2xl font-bold mt-1 text-red-600">
                                {MOCK_PRODUCTS.filter(p => p.status === 'out_of_stock').length}
                            </p>
                        </div>
                        <Package className="w-8 h-8 text-red-600" />
                    </div>
                </Card>
            </div>

            {/* Filters & Search */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="all">All Categories</option>
                        <option value="laptops">Laptops</option>
                        <option value="phones">Phones</option>
                        <option value="desktops">Desktops</option>
                        <option value="accessories">Accessories</option>
                        <option value="tablets">Tablets</option>
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

            {/* Products Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sales</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{product.name}</div>
                                        <div className="text-sm text-gray-500">ID: #{product.id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4 text-sm font-semibold">${product.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' :
                                                product.stock < 20 ? 'text-yellow-600' :
                                                    'text-green-600'
                                            }`}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.sales} sold</td>
                                    <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit Product
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {filteredProducts.length} of {MOCK_PRODUCTS.length} products
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
