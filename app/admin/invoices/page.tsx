'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import {
    Search,
    Filter,
    Download,
    Plus,
    FileText,
    Printer,
    MoreVertical,
    ArrowUpRight,
    ArrowDownLeft,
    Loader2
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

interface Invoice {
    id: string;
    invoiceNumber: string;
    date: Date;
    type: 'sale' | 'purchase';
    customerName?: string;
    vendorName?: string;
    total: number;
    status: 'paid' | 'pending' | 'overdue' | 'cancelled';
    items: any[];
}

export default function InvoicesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to real-time updates
        const q = query(
            collection(db, 'invoices'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const invoiceData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    invoiceNumber: data.invoiceNumber || '---',
                    date: data.createdAt?.toDate() || new Date(),
                    type: data.type || 'sale',
                    customerName: data.customerName || 'Unknown',
                    vendorName: data.vendorName || 'Unknown',
                    total: data.total || 0,
                    status: data.status || 'pending',
                    items: data.items || []
                } as Invoice;
            });
            setInvoices(invoiceData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching invoices:", error);
            toast.error("Failed to load invoices");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            paid: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            overdue: 'bg-red-100 text-red-700',
            cancelled: 'bg-gray-100 text-gray-700'
        };
        return (
            <Badge className={`${styles[status] || 'bg-gray-100'} hover:${styles[status]} capitalize`}>
                {status}
            </Badge>
        );
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inv.customerName && inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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

                <TabsContent value="all" className="mt-0">
                    <InvoiceTable
                        invoices={filteredInvoices}
                        loading={loading}
                        badgeRenderer={getStatusBadge}
                    />
                </TabsContent>
                <TabsContent value="sales" className="mt-0">
                    <InvoiceTable
                        invoices={filteredInvoices.filter(i => i.type === 'sale')}
                        loading={loading}
                        badgeRenderer={getStatusBadge}
                    />
                </TabsContent>
                <TabsContent value="purchases" className="mt-0">
                    <InvoiceTable
                        invoices={filteredInvoices.filter(i => i.type === 'purchase')}
                        loading={loading}
                        badgeRenderer={getStatusBadge}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function InvoiceTable({
    invoices,
    loading,
    badgeRenderer
}: {
    invoices: Invoice[],
    loading: boolean,
    badgeRenderer: (s: string) => React.ReactNode
}) {
    if (loading) {
        return (
            <Card className="p-8 flex justify-center text-gray-500">
                <Loader2 className="animate-spin w-8 h-8" />
            </Card>
        );
    }

    if (invoices.length === 0) {
        return (
            <Card className="p-8 text-center text-gray-500">
                No invoices found.
            </Card>
        );
    }

    return (
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
                    {invoices.map((inv) => (
                        <TableRow key={inv.id}>
                            <TableCell className="font-mono font-medium">{inv.invoiceNumber}</TableCell>
                            <TableCell className="text-gray-500">{inv.date.toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className={`flex items-center text-xs font-semibold ${inv.type === 'sale' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {inv.type === 'sale' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownLeft className="w-3 h-3 mr-1" />}
                                    {inv.type.toUpperCase()}
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">
                                {inv.type === 'sale' ? inv.customerName : inv.vendorName}
                            </TableCell>
                            <TableCell>${inv.total.toLocaleString()}</TableCell>
                            <TableCell>{badgeRenderer(inv.status)}</TableCell>
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
    );
}
