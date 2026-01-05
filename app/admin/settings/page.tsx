'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Store,
    Bell,
    Shield,
    Palette,
    Mail,
    Save,
    Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [storeName, setStoreName] = useState('LapTek');
    const [storeEmail, setStoreEmail] = useState('support@laptek.com');
    const [storePhone, setStorePhone] = useState('+1 (555) 123-4567');

    const handleSave = () => {
        toast.success('Settings saved successfully!');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your store configuration and preferences</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 lg:w-auto">
                    <TabsTrigger value="general">
                        <Store className="w-4 h-4 mr-2" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Shield className="w-4 h-4 mr-2" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="appearance">
                        <Palette className="w-4 h-4 mr-2" />
                        Appearance
                    </TabsTrigger>
                    <TabsTrigger value="email">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Store Information</h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="storeName">Store Name</Label>
                                <Input
                                    id="storeName"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="storeEmail">Contact Email</Label>
                                <Input
                                    id="storeEmail"
                                    type="email"
                                    value={storeEmail}
                                    onChange={(e) => setStoreEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="storePhone">Phone Number</Label>
                                <Input
                                    id="storePhone"
                                    value={storePhone}
                                    onChange={(e) => setStorePhone(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="storeAddress">Store Address</Label>
                                <Input
                                    id="storeAddress"
                                    placeholder="123 Main St, City, State 12345"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Business Settings</h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="currency">Currency</Label>
                                <select id="currency" className="px-3 py-2 border rounded-lg">
                                    <option>USD ($)</option>
                                    <option>EUR (€)</option>
                                    <option>GBP (£)</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <select id="timezone" className="px-3 py-2 border rounded-lg">
                                    <option>UTC-8 (Pacific Time)</option>
                                    <option>UTC-5 (Eastern Time)</option>
                                    <option>UTC+0 (GMT)</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                                <Input
                                    id="taxRate"
                                    type="number"
                                    placeholder="8.5"
                                />
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'New Orders', description: 'Receive email when a new order is placed' },
                                { label: 'Low Stock Alerts', description: 'Get notified when products are running low' },
                                { label: 'Customer Reviews', description: 'Notification for new product reviews' },
                                { label: 'Weekly Reports', description: 'Receive weekly sales and analytics reports' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{item.label}</p>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Preferences
                        </Button>
                    </div>
                </TabsContent>

                {/* Security */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                        <div className="space-y-4 max-w-md">
                            <div className="grid gap-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input id="confirmPassword" type="password" />
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700">Update Password</Button>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                        <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                        <Button variant="outline">Enable 2FA</Button>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
                        <div className="space-y-4">
                            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                                <p className="font-medium mb-2">Delete Account</p>
                                <p className="text-sm text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Appearance */}
                <TabsContent value="appearance" className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Theme</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {['Light', 'Dark', 'Auto'].map((theme) => (
                                <button
                                    key={theme}
                                    className="p-6 border-2 rounded-lg hover:border-blue-500 transition-colors"
                                >
                                    <div className={`w-full h-20 rounded mb-2 ${theme === 'Light' ? 'bg-white border' :
                                            theme === 'Dark' ? 'bg-gray-900' :
                                                'bg-gradient-to-r from-white to-gray-900'
                                        }`} />
                                    <p className="font-medium">{theme}</p>
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Brand Colors</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Primary Color</Label>
                                <div className="flex gap-2">
                                    <input type="color" defaultValue="#3b82f6" className="w-12 h-10 rounded" />
                                    <Input value="#3b82f6" readOnly />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Accent Color</Label>
                                <div className="flex gap-2">
                                    <input type="color" defaultValue="#8b5cf6" className="w-12 h-10 rounded" />
                                    <Input value="#8b5cf6" readOnly />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Appearance
                        </Button>
                    </div>
                </TabsContent>

                {/* Email */}
                <TabsContent value="email" className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">SMTP Configuration</h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>SMTP Host</Label>
                                <Input placeholder="smtp.gmail.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Port</Label>
                                    <Input placeholder="587" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Encryption</Label>
                                    <select className="px-3 py-2 border rounded-lg">
                                        <option>TLS</option>
                                        <option>SSL</option>
                                        <option>None</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Username</Label>
                                <Input placeholder="your-email@gmail.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Password</Label>
                                <Input type="password" placeholder="••••••••" />
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline">Test Connection</Button>
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Email Settings
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
