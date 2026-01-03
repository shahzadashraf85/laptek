'use client';

import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <a>{text}</a>,
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (text: number) => `$${text}`,
    },
    {
        title: 'Stock',
        dataIndex: 'stock',
        key: 'stock',
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (_: any, { stock }: any) => (
            <Tag color={stock > 0 ? 'green' : 'red'}>
                {stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Tag>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_: any, record: any) => (
            <Space size="middle">
                <a>Edit</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'MacBook Pro 16"',
        price: 2499,
        stock: 50,
    },
    {
        key: '2',
        name: 'Dell XPS 13',
        price: 1299,
        stock: 0,
    },
    {
        key: '3',
        name: 'iPhone 16 Pro',
        price: 999,
        stock: 200,
    },
];

export default function ProductsPage() {
    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Products Management</h2>
                <Link href="/admin/products/new">
                    <Button type="primary" icon={<PlusOutlined />}>Add Product</Button>
                </Link>
            </div>
            <Table columns={columns} dataSource={data} />
        </div>
    );
}
