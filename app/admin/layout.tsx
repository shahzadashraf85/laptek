import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import AdminShell from './AdminShell';

export const metadata = {
    title: 'Admin Platform | LapTek',
    description: 'Manage products, orders, and marketplace integrations',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AntdRegistry>
            <AdminShell>
                {children}
            </AdminShell>
        </AntdRegistry>
    );
}
