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
    Plus,
    FileText,
    Printer,
    MoreVertical,
    ArrowUpRight,
    ArrowDownLeft
} from 'lucide-react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const MOCK_INVOICES = [
    { id: 'INV-001', date: '2024-01-05', customer: 'John Doe', amount: 1299.00, status: 'paid', type: 'sale' },
    { id: 'INV-002', date: '2024-01-04', customer: 'TechDistro Inc', amount: 5000.00, status: 'pending', type: 'purchase' },
    { id: 'INV-003', date: '2024-01-04', customer: 'Alice Brown', amount: 1547.00, status: 'paid', type: 'sale' },
    { id: 'INV-004', date: '2024-01-03', customer: 'Office Depot', amount: 450.50, status: 'paid', type: 'purchase' },
    { id: 'INV-005', date: '2024-01-02', customer: 'Charlie Wilson', amount: 3499.00, status: 'overdue', type: 'sale' },
];

export default function InvoicesPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusBadge = (status: string) => {
        const styles = {
            paid: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            overdue: 'bg-red-100 text-red-700'
        };
        return (
            <Badge className={`${styles[status as keyof typeof styles]} hover:${styles[status as keyof typeof styles]} capitalize`}>
                {status}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Invoices</h1>
                    <p className="text-gray-500 mt-1">Manage sales and purchase invoices</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Invoice
                </Button>
            </div>

            <Tabs defaultValue="all" className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <TabsList>
                        <TabsTrigger value="all">All Invoices</TabsTrigger>
                        <TabsTrigger value="sales" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                            Sales
                        </TabsTrigger>
                        <TabsTrigger value="purchases" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
                            Purchases
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-initial">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search invoice #..."
                                className="pl-9 w-full md:w-[250px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Customer/Vendor</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_INVOICES.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-mono font-medium">{inv.id}</TableCell>
                                    <TableCell className="text-gray-500">{inv.date}</TableCell>
                                    <TableCell>
                                        <div className={`flex items-center text-xs font-semibold ${inv.type === 'sale' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {inv.type === 'sale' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownLeft className="w-3 h-3 mr-1" />}
                                            {inv.type.toUpperCase()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{inv.customer}</TableCell>
                                    <TableCell>${inv.amount.toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(inv.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Printer className="w-4 h-4" />
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
            </Tabs>
        </div>
    );
}
