'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Tag,
    Plus,
    Calendar,
    Percent,
    DollarSign,
    MoreVertical,
    Copy,
    CheckCircle,
    Clock
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from 'react-hot-toast';

const MOCK_PROMOTIONS = [
    { id: 1, code: 'WELCOME10', type: 'percentage', value: 10, usage: 145, status: 'active', expires: '2024-12-31' },
    { id: 2, code: 'SUMMER50', type: 'fixed', value: 50, usage: 23, status: 'expired', expires: '2023-08-31' },
    { id: 3, code: 'FLASH20', type: 'percentage', value: 20, usage: 89, status: 'active', expires: '2024-10-15' },
    { id: 4, code: 'FREESHIP', type: 'shipping', value: 0, usage: 56, status: 'scheduled', expires: '2024-11-01' },
];

export default function PromotionsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
            case 'expired':
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Expired</Badge>;
            case 'scheduled':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Scheduled</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Promotions</h1>
                    <p className="text-gray-500 mt-1">Manage discount codes and coupons</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Code
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Promotion Code</DialogTitle>
                            <DialogDescription>
                                Add a new discount code for your customers.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="code">Coupon Code</Label>
                                <Input id="code" placeholder="e.g. SUMMER2024" className="uppercase" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Discount Type</Label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                        <option value="shipping">Free Shipping</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="value">Value</Label>
                                    <Input id="value" type="number" placeholder="20" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" type="date" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button className="bg-blue-600" onClick={() => {
                                toast.success('Promotion created!');
                                setIsCreateOpen(false);
                            }}>Create Code</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Active Codes</p>
                        <p className="text-2xl font-bold">{MOCK_PROMOTIONS.filter(p => p.status === 'active').length}</p>
                    </div>
                    <Tag className="w-8 h-8 text-blue-600" />
                </Card>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Total Usage</p>
                        <p className="text-2xl font-bold text-green-600">313</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </Card>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Scheduled</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {MOCK_PROMOTIONS.filter(p => p.status === 'scheduled').length}
                        </p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-600" />
                </Card>
            </div>

            {/* Promotions Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Uses</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_PROMOTIONS.map((promo) => (
                            <TableRow key={promo.id}>
                                <TableCell className="font-mono font-bold text-blue-600">
                                    {promo.code}
                                </TableCell>
                                <TableCell className="capitalize">{promo.type}</TableCell>
                                <TableCell>
                                    {promo.type === 'percentage' ? `${promo.value}%` :
                                        promo.type === 'fixed' ? `$${promo.value}` : '-'}
                                </TableCell>
                                <TableCell>{promo.usage}</TableCell>
                                <TableCell>{getStatusBadge(promo.status)}</TableCell>
                                <TableCell className="text-sm text-gray-500">{promo.expires}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => copyCode(promo.code)}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
