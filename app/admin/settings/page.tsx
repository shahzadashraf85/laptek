'use client';

import React from 'react';
import { Form, Input, Button, Card, Switch } from 'antd';

export default function SettingsPage() {
    return (
        <div style={{ maxWidth: 600 }}>
            <h2 style={{ marginBottom: 24 }}>System Settings</h2>

            <Card title="General" variant="borderless" style={{ marginBottom: 24 }}>
                <Form layout="vertical">
                    <Form.Item label="Store Name">
                        <Input defaultValue="LapTek" />
                    </Form.Item>
                    <Form.Item label="Support Email">
                        <Input defaultValue="support@laptek.com" />
                    </Form.Item>
                </Form>
            </Card>

            <Card title="Notifications" variant="borderless">
                <Form layout="horizontal">
                    <Form.Item label="Email Alerts">
                        <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="Order Notifications">
                        <Switch defaultChecked />
                    </Form.Item>
                </Form>
            </Card>

            <div style={{ marginTop: 24 }}>
                <Button type="primary">Save Changes</Button>
            </div>
        </div>
    );
}
