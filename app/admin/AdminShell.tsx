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
    MessageOutlined,
    FileTextOutlined,
    BankOutlined
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

        // Add a safety timeout to stop loading if Firebase hangs
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn("Auth check timed out after 10 seconds");
                setLoading(false);
            }
        }, 10000);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            clearTimeout(timeoutId); // Clear timeout if auth responds
            if (user) {
                // Check if user has admin role in Firestore
                try {
                    // Check 'user' (singular) first
                    // Check 'users' (plural) collection which matches our schema and security rules
                    let userDoc = await getDoc(doc(db, "users", user.uid));

                    // Fallback to 'user' (singular) only if needed, but wrap in try-catch to avoid permission errors breaking the flow
                    if (!userDoc.exists()) {
                        try {
                            const singularDoc = await getDoc(doc(db, "user", user.uid));
                            if (singularDoc.exists()) {
                                userDoc = singularDoc;
                            }
                        } catch (e) {
                            console.warn("Could not read legacy 'user' collection", e);
                        }
                    }

                    console.log("Admin Check - UID:", user.uid);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log("Admin Check - Firestore Data:", userData);
                        if (userData.role === 'admin') {
                            setAuthorized(true);
                        } else {
                            console.warn("User role is NOT admin. Role found:", userData.role);
                        }
                    } else {
                        console.warn("User document does not exist in Firestore for UID:", user.uid);
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

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
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
            key: '/admin/invoices',
            icon: <FileTextOutlined />,
            label: 'Invoices',
        },
        {
            key: '/admin/accounts',
            icon: <BankOutlined />,
            label: 'Accounts',
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
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
                <Spin size="large" />
                <div style={{ marginTop: 24, fontSize: 16, color: '#666' }}>Verifying Administrator Access...</div>
            </div>
        );
    }

    if (!authorized) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5' }}>
                <div style={{ background: '#fff', padding: 40, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: 400 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
                    <h1 style={{ color: '#ff4d4f', fontSize: 24, marginBottom: 16 }}>Access Denied</h1>
                    <p style={{ color: '#666', marginBottom: 24 }}>You do not have the required permissions to access the Admin Console.</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <Button type="primary" onClick={() => router.push('/')}>Go Home</Button>
                        <Button onClick={() => router.push('/login')}>Login as Admin</Button>
                    </div>
                    <p style={{ marginTop: 24, fontSize: 12, color: '#999' }}>If you believe this is an error, please contact support.</p>
                </div>
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
