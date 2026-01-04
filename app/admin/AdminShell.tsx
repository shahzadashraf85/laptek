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
    LogoutOutlined
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

    useEffect(() => {
        // Safety check: Don't call onAuthStateChanged if auth is not initialized
        if (!auth || !auth.app) {
            console.error("Firebase Auth not initialized. Please check your environment variables.");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Check if user has admin role in Firestore
                // Note: In a real production app, use Custom Claims for better security
                try {
                    const userDoc = await getDoc(doc(db, "user", user.uid));
                    console.log("Admin Check - UID:", user.uid);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log("Admin Check - Firestore Data:", userData);
                        if (userData.role === 'admin') {
                            setAuthorized(true);
                        } else {
                            console.warn("User role is NOT admin. Role found:", userData.role);
                            // Do not redirect, let the UI show the error
                        }
                    } else {
                        console.warn("User document does not exist in Firestore for UID:", user.uid);
                        // Do not redirect, let the UI show the error
                    }
                } catch (error) {
                    console.error("Auth check failed", error);
                }
            } else {
                // Not logged in, redirect away silently
                router.replace('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

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
            type: 'divider' as const,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
        }
    ];

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16, color: 'rgba(0, 0, 0, 0.45)' }}>Verifying Access...</div>
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
