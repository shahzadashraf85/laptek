'use client';

import React, { useState } from 'react';
import { Table, Tag, Switch, Button, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

interface ProductMarketplaceData {
    key: string;
    name: string;
    sku: string;
    amazonPrice: number;
    amazonStatus: 'LIVE' | 'PENDING' | 'ERROR';
    amazonEnabled: boolean;
    bestBuyStatus: 'LIVE' | 'PENDING' | 'ERROR';
    bestBuyEnabled: boolean;
}

const initialData: ProductMarketplaceData[] = [
    {
        key: '1',
        name: 'MacBook Pro 16"',
        sku: 'MBP-16-M3',
        amazonPrice: 2499,
        amazonStatus: 'LIVE',
        amazonEnabled: true,
        bestBuyStatus: 'PENDING',
        bestBuyEnabled: true,
    },
    {
        key: '2',
        name: 'Dell XPS 13',
        sku: 'DELL-XPS-13',
        amazonPrice: 1299,
        amazonStatus: 'ERROR',
        amazonEnabled: true,
        bestBuyStatus: 'LIVE',
        bestBuyEnabled: true,
    },
];

export default function MarketplacesPage() {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);

    const handleSync = () => {
        setLoading(true);
        // Simulate API call to N8N webhook
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
        },
        {
            title: 'Amazon',
            children: [
                {
                    title: 'Status',
                    key: 'amazonStatus',
                    render: (_: any, record: ProductMarketplaceData) => (
                        <Tag color={record.amazonStatus === 'LIVE' ? 'green' : record.amazonStatus === 'ERROR' ? 'red' : 'orange'}>
                            {record.amazonStatus}
                        </Tag>
                    )
                },
                {
                    title: 'Enabled',
                    key: 'amazonEnabled',
                    render: (_: any, record: ProductMarketplaceData) => (
                        <Switch checked={record.amazonEnabled} onChange={() => { }} />
                    )
                }
            ]
        },
        {
            title: 'Best Buy',
            children: [
                {
                    title: 'Status',
                    key: 'bestBuyStatus',
                    render: (_: any, record: ProductMarketplaceData) => (
                        <Tag color={record.bestBuyStatus === 'LIVE' ? 'green' : record.bestBuyStatus === 'ERROR' ? 'red' : 'orange'}>
                            {record.bestBuyStatus}
                        </Tag>
                    )
                },
                {
                    title: 'Enabled',
                    key: 'bestBuyEnabled',
                    render: (_: any, record: ProductMarketplaceData) => (
                        <Switch checked={record.bestBuyEnabled} onChange={() => { }} />
                    )
                }
            ]
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: ProductMarketplaceData) => (
                <Space>
                    <Button size="small" icon={<SyncOutlined />} onClick={handleSync}>Sync</Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Marketplace Integration</h2>
                <Button type="primary" icon={<SyncOutlined spin={loading} />} onClick={handleSync} loading={loading}>
                    Sync All Inventory
                </Button>
            </div>
            <Table columns={columns} dataSource={data} bordered />
        </div>
    );
}
