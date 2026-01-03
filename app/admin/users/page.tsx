'use client';

import React from 'react';
import { Table, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const columns = [
    {
        title: 'Avatar',
        key: 'avatar',
        render: () => <Avatar icon={<UserOutlined />} />,
        width: 60,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
];

const data = [
    {
        key: '1',
        name: 'Admin User',
        email: 'admin@laptek.com',
        role: 'Admin',
    },
    {
        key: '2',
        name: 'Customer One',
        email: 'user@example.com',
        role: 'Customer',
    },
];

export default function UsersPage() {
    return (
        <div>
            <h2 style={{ marginBottom: 16 }}>Users</h2>
            <Table columns={columns} dataSource={data} />
        </div>
    );
}
