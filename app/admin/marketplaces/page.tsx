'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    RefreshCw,
    Globe,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ExternalLink,
    Settings,
    Activity
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const MARKETPLACES = [
    {
        id: 1,
        name: 'Amazon',
        region: 'US',
        status: 'connected',
        lastSync: '10 mins ago',
        productsSynced: 450,
        errors: 2,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
    },
    {
        id: 2,
        name: 'Best Buy',
        region: 'US',
        status: 'connected',
        lastSync: '1 hour ago',
        productsSynced: 120,
        errors: 0,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg'
    },
    {
        id: 3,
        name: 'eBay',
        region: 'Global',
        status: 'disconnected',
        lastSync: 'Never',
        productsSynced: 0,
        errors: 0,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg'
    }
];

const SYNC_LOGS = [
    { time: '10:45 AM', platform: 'Amazon', action: 'Price Update', status: 'success', details: 'Updated 45 prices' },
    { time: '10:42 AM', platform: 'Amazon', action: 'Inventory Sync', status: 'error', details: 'Failed to sync SKU-123' },
    { time: '09:30 AM', platform: 'Best Buy', action: 'Order Import', status: 'success', details: 'Imported 12 orders' },
];

export default function MarketplacesPage() {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = (platform: string) => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Marketplace Integration</h1>
                    <p className="text-gray-500 mt-1">Manage synchronization with external platforms</p>
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSync('all')}
                    disabled={isSyncing}
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    Sync All Marketplaces
                </Button>
            </div>

            {/* Platforms Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {MARKETPLACES.map((platform) => (
                    <Card key={platform.id} className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-12 w-24 relative flex items-center">
                                {/* Using text for demo, but normally would contain logo images */}
                                <span className="text-xl font-bold">{platform.name}</span>
                            </div>
                            <Badge
                                variant={platform.status === 'connected' ? 'default' : 'secondary'}
                                className={platform.status === 'connected' ? 'bg-green-100 text-green-700' : ''}
                            >
                                {platform.status === 'connected' ? 'Connected' : 'Disconnected'}
                            </Badge>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Region</span>
                                <span className="font-medium flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> {platform.region}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Last Sync</span>
                                <span className="font-medium">{platform.lastSync}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Products Synced</span>
                                <span className="font-medium">{platform.productsSynced}</span>
                            </div>
                            {platform.errors > 0 && (
                                <div className="flex justify-between text-sm text-red-600 bg-red-50 p-2 rounded">
                                    <span className="flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> Sync Errors
                                    </span>
                                    <span className="font-bold">{platform.errors}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {platform.status === 'connected' ? (
                                <>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleSync(platform.name)}
                                        disabled={isSyncing}
                                    >
                                        <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                                        Sync Now
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </>
                            ) : (
                                <Button className="w-full">
                                    Connect Account
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Sync Logs */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-gray-500" />
                        Recent Sync Activity
                    </h3>
                    <Button variant="link" className="text-blue-600">View All Logs</Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Platform</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {SYNC_LOGS.map((log, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-gray-500 font-mono text-xs">{log.time}</TableCell>
                                <TableCell className="font-medium">{log.platform}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>
                                    {log.status === 'success' ? (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex w-fit gap-1">
                                            <CheckCircle className="w-3 h-3" /> Success
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex w-fit gap-1">
                                            <XCircle className="w-3 h-3" /> Failed
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-gray-500">{log.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
