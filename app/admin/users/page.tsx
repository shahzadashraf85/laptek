'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
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
    CheckCircle,
    Loader2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from 'react-hot-toast';

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    joined: Date;
    avatar?: string;
    location?: string;
    ordersCount?: number;
    totalSpent?: number;
}

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Real-time subscription to users collection
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: typeof data.displayName === 'object' ? (data.displayName?.en || String(data.displayName)) : (data.displayName || data.name || 'Unknown User'),
                    email: data.email || 'No Email',
                    role: data.role || 'customer', // default to customer
                    status: data.status || 'active',
                    joined: data.createdAt?.toDate() || new Date(),
                    avatar: data.photoURL || '',
                    location: data.address?.city ? `${data.address.city}, ${data.address.country}` : 'Unknown',
                    ordersCount: data.stats?.ordersCount || 0, // Assuming we sync these stats later
                    totalSpent: data.stats?.totalSpent || 0
                };
            });
            setUsers(fetchedUsers);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users:", error);
            // Don't show toast on every error to avoid spam if permission denied initially
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-gray-500 mt-1">Manage customer accounts and permissions</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <User className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search users by name, email..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                </div>
            </Card>

            {/* Users List */}
            <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No users found.</div>
                ) : filteredUsers.map((user) => (
                    <Card key={user.id} className="p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            {/* User Info */}
                            <div className="flex items-center gap-4 min-w-[250px]">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                    <div className="flex items-center text-sm text-gray-500 gap-2">
                                        <Mail className="w-3 h-3" />
                                        {user.email}
                                    </div>
                                </div>
                            </div>

                            {/* Role & Status */}
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <Badge variant="outline" className={`capitalize ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                                    }`}>
                                    {user.role}
                                </Badge>
                                <Badge className={`capitalize ${user.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'
                                    }`}>
                                    {user.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Ban className="w-3 h-3 mr-1" />}
                                    {user.status}
                                </Badge>
                            </div>

                            {/* Details */}
                            <div className="flex items-center gap-6 text-sm text-gray-500 min-w-[250px]">
                                <div className="flex items-center gap-2" title="Location">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate max-w-[100px]">{user.location}</span>
                                </div>
                                <div className="flex items-center gap-2" title="Joined Date">
                                    <Calendar className="w-4 h-4" />
                                    <span>{user.joined.toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-col items-end min-w-[100px] gap-1">
                                <span className="font-bold text-gray-900">${(user.totalSpent || 0).toLocaleString()}</span>
                                <span className="text-xs text-gray-500">{user.ordersCount || 0} orders</span>
                            </div>

                            {/* Actions */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Suspend User</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
