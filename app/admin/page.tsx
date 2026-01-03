'use client';

import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
];

export default function AdminDashboard() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Card variant="borderless">
                        <Statistic
                            title="Total Sales"
                            value={112893}
                            precision={2}
                            styles={{ content: { color: '#3f8600' } }}
                            prefix={<DollarOutlined />}
                            suffix=""
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card variant="borderless">
                        <Statistic
                            title="Orders"
                            value={93}
                            styles={{ content: { color: '#cf1322' } }}
                            prefix={<ShoppingCartOutlined />}
                            suffix=""
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card variant="borderless">
                        <Statistic
                            title="Active Users"
                            value={1128}
                            prefix={<UserOutlined />}
                            suffix=""
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Revenue Trend" variant="borderless">
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
