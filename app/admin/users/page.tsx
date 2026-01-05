'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Search,
    Filter,
    Download,
    MoreVertical,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShoppingBag,
    Ban,
    CheckCircle
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_USERS = [
    {
        id: 1,
        name: 'Shahzad Ashraf',
        email: 'admin@laptek.com',
        role: 'Admin',
        status: 'active',
        joined: '2023-01-01',
        orders: 12,
        spent: 15430,
        avatar: 'https://github.com/shadcn.png',
        location: 'New York, USA'
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'Customer',
        status: 'active',
        joined: '2023-05-15',
        orders: 5,
        spent: 4500,
        avatar: '',
        location: 'London, UK'
    },
    {
        id: 3,
        name: 'Mike Brown',
        email: 'mike@example.com',
        role: 'Customer',
        status: 'blocked',
        joined: '2023-08-20',
        orders: 0,
        spent: 0,
        avatar: '',
        location: 'Toronto, Canada'
    },
    {
        id: 4,
        name: 'Emily Davis',
        email: 'emily@example.com',
        role: 'Customer',
        status: 'active',
        joined: '2023-11-10',
        orders: 3,
        spent: 1200,
        avatar: '',
        location: 'Sydney, Australia'
    },
    {
        id: 5,
        name: 'David Wilson',
        email: 'david@example.com',
        role: 'Moderator',
        status: 'active',
        joined: '2023-03-22',
        orders: 8,
        spent: 8900,
        avatar: '',
        location: 'Berlin, Germany'
    },
];

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const filteredUsers = MOCK_USERS.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
            case 'blocked':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Blocked</Badge>;
            case 'inactive':
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-gray-500 mt-1">Manage customer accounts and permissions</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <User className="w-4 h-4 mr-2" />
                    Add New User
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold">{MOCK_USERS.length}</p>
                    </div>
                    <User className="w-8 h-8 text-blue-600" />
                </Card>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Active Customers</p>
                        <p className="text-2xl font-bold text-green-600">
                            {MOCK_USERS.filter(u => u.status === 'active').length}
                        </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </Card>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Blocked/Inactive</p>
                        <p className="text-2xl font-bold text-red-600">
                            {MOCK_USERS.filter(u => u.status !== 'active').length}
                        </p>
                    </div>
                    <Ban className="w-8 h-8 text-red-600" />
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                        <option value="moderator">Moderator</option>
                    </select>
                    <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </Card>

            {/* Users Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Orders</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="font-normal capitalize">
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="w-3 h-3" />
                                            {user.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <span className="font-semibold">{user.orders}</span> orders
                                            <br />
                                            <span className="text-xs text-gray-500">Total: ${user.spent.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <User className="w-4 h-4 mr-2" /> View Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail className="w-4 h-4 mr-2" /> Send Email
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Ban className="w-4 h-4 mr-2" /> Block User
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
                        Showing {filteredUsers.length} of {MOCK_USERS.length} users
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
