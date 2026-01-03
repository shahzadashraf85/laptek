'use client';

import React from 'react';
import { Table, Tag } from 'antd';

const columns = [
    {
        title: 'Order ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer',
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (status: string) => (
            <Tag color={status === 'Completed' ? 'green' : 'blue'}>
                {status.toUpperCase()}
            </Tag>
        ),
    },
];

const data = [
    {
        key: '1',
        id: '#ORD-001',
        customer: 'John Doe',
        total: '$2,499.00',
        status: 'Completed',
    },
    {
        key: '2',
        id: '#ORD-002',
        customer: 'Jane Smith',
        total: '$1,299.00',
        status: 'Processing',
    },
];

export default function OrdersPage() {
    return (
        <div>
            <h2 style={{ marginBottom: 16 }}>Orders</h2>
            <Table columns={columns} dataSource={data} />
        </div>
    );
}
