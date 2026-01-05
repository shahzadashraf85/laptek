'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    Wallet,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ACCOUNTS_DATA = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
    { name: 'Jul', income: 3490, expense: 4300 },
];

const TRANSACTIONS = [
    { id: 'TRX-9871', date: '2024-01-05', type: 'Credit', description: 'Product Sale - Invoice #INV-001', amount: 1299.00, status: 'completed' },
    { id: 'TRX-9872', date: '2024-01-04', type: 'Debit', description: 'Office Supplies - Amazon', amount: 450.50, status: 'completed' },
    { id: 'TRX-9873', date: '2024-01-04', type: 'Debit', description: 'Vendor Payment - TechDistro Inc', amount: 5000.00, status: 'processing' },
    { id: 'TRX-9874', date: '2024-01-03', type: 'Credit', description: 'Service Refund', amount: 150.00, status: 'completed' },
    { id: 'TRX-9875', date: '2024-01-02', type: 'Credit', description: 'Product Sale - Invoice #INV-005', amount: 3499.00, status: 'completed' },
];

export default function AccountsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Financial Accounts</h1>
                    <p className="text-gray-500 mt-1">Overview of cash flow, income, and expenses</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        This Month
                    </Button>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Report
                    </Button>
                </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-blue-600">Total Income</p>
                        <ArrowUpRight className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">$124,592.00</p>
                    <div className="flex items-center mt-1 text-xs text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12.5% from last month
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-pink-50 to-white border-pink-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-pink-600">Total Expenses</p>
                        <ArrowDownLeft className="w-4 h-4 text-pink-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">$45,200.00</p>
                    <div className="flex items-center mt-1 text-xs text-red-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +4.1% from last month
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-green-600">Net Profit</p>
                        <Wallet className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">$79,392.00</p>
                    <div className="flex items-center mt-1 text-xs text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +8.2% healthy margin
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-purple-600">Pending</p>
                        <CreditCard className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">$12,450.00</p>
                    <p className="text-xs text-gray-500 mt-1">Unpaid invoices</p>
                </Card>
            </div>

            {/* Charts & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <Card className="lg:col-span-2 p-6">
                    <h3 className="text-lg font-bold mb-6">Cash Flow Analysis</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ACCOUNTS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#db2777" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#db2777" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="income" stroke="#2563eb" fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#db2777" fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Transactions List */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
                    <div className="space-y-4">
                        {TRANSACTIONS.map((trx) => (
                            <div key={trx.id} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${trx.type === 'Credit' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                        <DollarSign className={`w-4 h-4 ${trx.type === 'Credit' ? 'text-green-600' : 'text-red-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{trx.description}</p>
                                        <p className="text-xs text-gray-500">{trx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${trx.type === 'Credit' ? 'text-green-600' : 'text-gray-900'
                                        }`}>
                                        {trx.type === 'Credit' ? '+' : '-'}${trx.amount.toLocaleString()}
                                    </p>
                                    <span className="text-[10px] text-gray-400 uppercase">{trx.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
