'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme, ConfigProvider, Spin, Button } from 'antd';
import {

    DashboardOutlined,
    ShoppingOutlined,
    UserOutlined,
    AppstoreOutlined,
    ShopOutlined,
    SettingOutlined,
    LogoutOutlined,
    TagOutlined,
    MessageOutlined
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const { Header, Sider, Content } = Layout;

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // ... (useEffect remains same)

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    const menuItems = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/admin/products',
            icon: <ShoppingOutlined />,
            label: 'Products',
        },
        {
            key: '/admin/orders',
            icon: <AppstoreOutlined />,
            label: 'Orders',
        },
        {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: 'Users',
        },
        {
            key: '/admin/promotions',
            icon: <TagOutlined />,
            label: 'Promotions',
        },
        {
            key: '/admin/inbox',
            icon: <MessageOutlined />,
            label: 'Inbox',
        },
        {
            key: '/admin/marketplaces',
            icon: <ShopOutlined />,
            label: 'Marketplaces',
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
        },
    ];

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!authorized) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
                <h1 style={{ color: 'red', fontSize: 24 }}>Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <p style={{ marginTop: 10, color: '#666' }}>Please check the console (F12) for debugging details.</p>
                <Button onClick={() => router.push('/')} style={{ marginTop: 20 }}>Go Home</Button>
            </div>
        );
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#7c3aed',
                }
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible breakpoint="lg">
                    <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[pathname]}
                        selectedKeys={[pathname]}
                        items={menuItems}
                        onClick={({ key }) => {
                            if (key === 'logout') {
                                handleLogout();
                            } else {
                                router.push(key);
                            }
                        }}
                    />
                </Sider>
                <Layout>
                    <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 18, fontWeight: 'bold' }}>Admin Control Center</div>
                        <div style={{ fontSize: 14 }}>
                            <UserOutlined style={{ marginRight: 8 }} />
                            Administrator
                        </div>
                    </Header>
                    <Content style={{ margin: '16px 16px' }}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: '100%',
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}
