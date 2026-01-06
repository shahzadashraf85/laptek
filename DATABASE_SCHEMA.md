# Firestore Database Schema for Laptek E-Commerce

## Overview
This document describes the complete Firestore database structure for the Laptek e-commerce application.

---

## Collections

### 1. **users** (Main User Collection)
Stores user account information and profiles.

```typescript
{
  uid: string;                    // Firebase Auth UID
  email: string;
  displayName: string;
  role: 'customer' | 'admin' | 'moderator';
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin?: Timestamp;
  status: 'active' | 'blocked' | 'inactive';
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
  };
}
```

---

### 2. **products**
Main product catalog.

```typescript
{
  productId: string;              // Auto-generated
  title: {
    en: string;
  };
  short_description: {
    en: string;
  };
  category_code: string;          // e.g., "Computers/Laptops"
  brand: string;
  main_image_url: string;
  additional_images?: string[];
  
  specifications: {
    condition: string;            // "New", "Refurbished", etc.
    processor_type?: string;
    ram_size?: number;
    ssd_capacity?: number;
    screen_size?: number;
    graphics_card?: string;
    color?: string;
    [key: string]: any;           // Dynamic specs based on category
  };
  
  offer: {
    sku: string;
    price: number;
    compareAtPrice?: number;      // Original price for discounts
    costPrice?: number;           // For margin calculation (admin only)
    quantity: number;
    min_quantity_alert: number;
    state: string;                // "New", "Used", etc.
    discount_price?: number;
    discount_start_date?: Timestamp;
    discount_end_date?: Timestamp;
    warranty_days?: number;
  };
  
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  
  status: 'active' | 'draft' | 'archived';
  
  marketplace_sync?: {
    walmart?: { enabled: boolean; lastSync?: Timestamp; };
    bestbuy?: { enabled: boolean; lastSync?: Timestamp; };
  };
  
  stats?: {
    views: number;
    sales: number;
    rating: number;
    reviewCount: number;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;             // Admin UID
}
```

**Subcollections:**
- `products/{productId}/reviews` - Product reviews
- `products/{productId}/variants` - Product variants (sizes, colors, etc.)

---

### 3. **orders**
Customer orders and transactions.

```typescript
{
  orderId: string;                // Auto-generated
  userId: string;                 // Customer UID
  orderNumber: string;            // Human-readable (e.g., "ORD-2024-001")
  
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  
  billingAddress?: {
    // Same structure as shippingAddress
  };
  
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }>;
  
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  
  payment: {
    method: 'credit_card' | 'paypal' | 'stripe';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    paidAt?: Timestamp;
  };
  
  shipping: {
    method: string;
    carrier?: string;
    trackingNumber?: string;
    estimatedDelivery?: Timestamp;
    shippedAt?: Timestamp;
    deliveredAt?: Timestamp;
  };
  
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  
  notes?: string;
  internalNotes?: string;         // Admin only
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 4. **invoices**
Sales and purchase invoices.

```typescript
{
  invoiceId: string;
  invoiceNumber: string;          // e.g., "INV-001"
  type: 'sale' | 'purchase';
  
  // For sales
  customerId?: string;
  customerName?: string;
  
  // For purchases
  vendorId?: string;
  vendorName?: string;
  
  orderId?: string;               // Link to order if applicable
  
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  
  subtotal: number;
  tax: number;
  total: number;
  
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  
  dueDate?: Timestamp;
  paidDate?: Timestamp;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 5. **promotions**
Discount codes and promotional campaigns.

```typescript
{
  promoId: string;
  code: string;                   // Coupon code (e.g., "SAVE20")
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;                  // 20 for 20%, or dollar amount
  
  conditions?: {
    minPurchase?: number;
    maxUses?: number;
    perUserLimit?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
  };
  
  usage: {
    totalUses: number;
    remainingUses?: number;
  };
  
  status: 'active' | 'expired' | 'scheduled';
  
  validFrom: Timestamp;
  validUntil: Timestamp;
  
  createdAt: Timestamp;
  createdBy: string;              // Admin UID
}
```

**Subcollection:**
- `promotions/{promoId}/usage` - Track individual uses

---

### 6. **carts**
User shopping carts (persistent across sessions).

```typescript
{
  userId: string;                 // Document ID = userId
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
    imageUrl: string;
    addedAt: Timestamp;
  }>;
  
  updatedAt: Timestamp;
}
```

---

### 7. **wishlists**
User wishlists / favorites.

```typescript
{
  userId: string;                 // Document ID = userId
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    imageUrl: string;
    addedAt: Timestamp;
  }>;
  
  updatedAt: Timestamp;
}
```

---

### 8. **support_conversations**
Customer support chat/inbox.

```typescript
{
  conversationId: string;
  userId: string;                 // Customer UID
  userName: string;
  userEmail: string;
  
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  
  assignedTo?: string;            // Admin UID
  
  lastMessage?: {
    text: string;
    from: 'customer' | 'agent';
    timestamp: Timestamp;
  };
  
  unreadCount: number;            // For customer
  agentUnreadCount: number;       // For admin
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Subcollection:**
- `support_conversations/{conversationId}/messages`

```typescript
{
  messageId: string;
  from: 'customer' | 'agent';
  senderId: string;
  senderName: string;
  text: string;
  attachments?: string[];
  read: boolean;
  createdAt: Timestamp;
}
```

---

### 9. **notifications**
User notifications.

```typescript
{
  notificationId: string;
  userId: string;
  type: 'order_update' | 'promotion' | 'system' | 'support';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Timestamp;
}
```

---

### 10. **marketplace_settings**
Integration settings for Walmart, Best Buy, etc.

```typescript
{
  marketplace: 'walmart' | 'bestbuy' | 'amazon';
  enabled: boolean;
  
  credentials: {
    apiKey?: string;
    apiSecret?: string;
    merchantId?: string;
  };
  
  syncSettings: {
    autoSync: boolean;
    syncInterval: number;         // Minutes
    lastSync?: Timestamp;
  };
  
  updatedAt: Timestamp;
  updatedBy: string;
}
```

---

### 11. **sync_logs**
Marketplace synchronization logs.

```typescript
{
  logId: string;
  marketplace: string;
  action: 'product_sync' | 'inventory_update' | 'price_update';
  status: 'success' | 'failed' | 'partial';
  
  details: {
    productsProcessed: number;
    errors?: string[];
    warnings?: string[];
  };
  
  timestamp: Timestamp;
}
```

---

### 12. **analytics** & **sales_stats**
Business intelligence data (Admin only).

```typescript
// analytics
{
  date: string;                   // YYYY-MM-DD
  metrics: {
    pageViews: number;
    uniqueVisitors: number;
    conversionRate: number;
    averageOrderValue: number;
  };
}

// sales_stats
{
  period: string;                 // "2024-01", "2024-W01", "2024-01-01"
  revenue: number;
  orders: number;
  customers: number;
  topProducts: Array<{
    productId: string;
    sales: number;
    revenue: number;
  }>;
}
```

---

### 13. **site_settings**
Global site configuration.

```typescript
{
  settingKey: string;             // e.g., "general", "shipping", "payment"
  
  // Example for general settings
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  currency: string;
  timezone: string;
  
  // Example for shipping settings
  shippingRates?: Array<{
    region: string;
    rate: number;
    freeShippingThreshold?: number;
  }>;
  
  updatedAt: Timestamp;
  updatedBy: string;
}
```

---

## Indexes Required

Create these composite indexes in Firebase Console:

1. **products**
   - `status` ASC, `createdAt` DESC
   - `category_code` ASC, `status` ASC, `createdAt` DESC

2. **orders**
   - `userId` ASC, `createdAt` DESC
   - `status` ASC, `createdAt` DESC

3. **support_conversations**
   - `userId` ASC, `updatedAt` DESC
   - `status` ASC, `updatedAt` DESC

4. **notifications**
   - `userId` ASC, `read` ASC, `createdAt` DESC

---

## Initial Setup

Deploy security rules:
```bash
firebase deploy --only firestore:rules
```

Create initial admin user in Firestore Console:
```
Collection: users
Document ID: <your-firebase-auth-uid>
Data:
{
  email: "admin@laptek.com",
  displayName: "Admin User",
  role: "admin",
  status: "active",
  createdAt: <current timestamp>
}
```
