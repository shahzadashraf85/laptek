# Firestore Database Structure - Visual Overview

```
📦 Firestore Database (laptek)
│
├── 👥 users/
│   └── {userId}
│       ├── email: string
│       ├── displayName: string
│       ├── role: "admin" | "customer"
│       ├── address: {...}
│       └── preferences: {...}
│
├── 🛍️ products/
│   └── {productId}
│       ├── title: {en: string}
│       ├── category_code: string
│       ├── brand: string
│       ├── specifications: {...}
│       ├── offer: {price, sku, quantity...}
│       ├── status: "active" | "draft"
│       │
│       ├── 📝 reviews/
│       │   └── {reviewId}
│       │       ├── userId: string
│       │       ├── rating: number
│       │       └── comment: string
│       │
│       └── 🎨 variants/
│           └── {variantId}
│               ├── color: string
│               └── size: string
│
├── 📦 orders/
│   └── {orderId}
│       ├── userId: string
│       ├── orderNumber: string
│       ├── items: [{...}]
│       ├── pricing: {subtotal, tax, total}
│       ├── status: "pending" | "shipped" | "delivered"
│       └── shippingAddress: {...}
│
├── 🧾 invoices/
│   └── {invoiceId}
│       ├── type: "sale" | "purchase"
│       ├── invoiceNumber: string
│       ├── items: [{...}]
│       ├── total: number
│       └── status: "paid" | "pending"
│
├── 🎁 promotions/
│   └── {promoId}
│       ├── code: string
│       ├── type: "percentage" | "fixed_amount"
│       ├── value: number
│       ├── validFrom: Timestamp
│       ├── validUntil: Timestamp
│       │
│       └── 📊 usage/
│           └── {usageId}
│               ├── userId: string
│               └── usedAt: Timestamp
│
├── 🛒 carts/
│   └── {userId}
│       └── items: [{productId, quantity, price...}]
│
├── ❤️ wishlists/
│   └── {userId}
│       └── items: [{productId, addedAt...}]
│
├── 💬 support_conversations/
│   └── {conversationId}
│       ├── userId: string
│       ├── subject: string
│       ├── status: "open" | "resolved"
│       │
│       └── 📨 messages/
│           └── {messageId}
│               ├── from: "customer" | "agent"
│               ├── text: string
│               └── createdAt: Timestamp
│
├── 🔔 notifications/
│   └── {notificationId}
│       ├── userId: string
│       ├── type: string
│       ├── message: string
│       └── read: boolean
│
├── 🏪 marketplace_settings/
│   └── {marketplace}
│       ├── marketplace: "walmart" | "bestbuy"
│       ├── enabled: boolean
│       ├── credentials: {...}
│       └── syncSettings: {...}
│
├── 📋 sync_logs/
│   └── {logId}
│       ├── marketplace: string
│       ├── action: string
│       ├── status: "success" | "failed"
│       └── details: {...}
│
├── 📊 analytics/
│   └── {date}
│       └── metrics: {pageViews, visitors...}
│
├── 💰 sales_stats/
│   └── {period}
│       ├── revenue: number
│       ├── orders: number
│       └── topProducts: [{...}]
│
└── ⚙️ site_settings/
    ├── general/
    │   ├── siteName: string
    │   ├── supportEmail: string
    │   └── currency: string
    │
    ├── shipping/
    │   └── rates: [{region, rate...}]
    │
    └── payment/
        ├── methods: [...]
        └── taxRate: number
```

---

## 🔐 Access Control Matrix

| Collection | Public Read | User Read | User Write | Admin Read | Admin Write |
|------------|-------------|-----------|------------|------------|-------------|
| **products** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **users** | ❌ | Own only | Own only | ✅ | ✅ |
| **orders** | ❌ | Own only | Create only | ✅ | ✅ |
| **carts** | ❌ | Own only | Own only | ❌ | ❌ |
| **wishlists** | ❌ | Own only | Own only | ❌ | ❌ |
| **promotions** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **support_conversations** | ❌ | Own only | Create/Update | ✅ | ✅ |
| **notifications** | ❌ | Own only | Update only | ✅ | Create only |
| **marketplace_settings** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **analytics** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **site_settings** | ✅ | ✅ | ❌ | ✅ | ✅ |

---

## 🔄 Data Flow Examples

### Customer Places Order
```
1. User adds items to cart → carts/{userId}
2. User proceeds to checkout
3. Order created → orders/{orderId}
4. Cart cleared
5. Notification sent → notifications/{notificationId}
6. Inventory updated → products/{productId}.offer.quantity
```

### Admin Creates Product
```
1. Admin fills form → /admin/products/new
2. Product saved → products/{productId}
3. If marketplace sync enabled → sync_logs/{logId}
4. Analytics updated → analytics/{date}
```

### Customer Support Flow
```
1. User sends message → support_conversations/{conversationId}
2. Message added → messages/{messageId}
3. Admin receives notification → notifications/{adminId}
4. Admin responds → messages/{messageId}
5. User receives notification → notifications/{userId}
```

---

## 📈 Scalability Considerations

### Current Structure
- ✅ Supports unlimited products
- ✅ Supports unlimited users
- ✅ Efficient querying with indexes
- ✅ Subcollections for related data

### Future Enhancements
- 🔄 Sharding for high-traffic collections
- 🔄 Cloud Functions for automated tasks
- 🔄 Firestore triggers for real-time updates
- 🔄 BigQuery export for advanced analytics

---

## 🎯 Quick Reference

### Most Used Collections
1. **products** - Main product catalog
2. **orders** - Customer orders
3. **users** - User accounts
4. **carts** - Shopping carts

### Admin-Only Collections
1. **marketplace_settings** - Integration config
2. **analytics** - Business metrics
3. **sales_stats** - Revenue data
4. **sync_logs** - Sync history

### User-Specific Collections
1. **carts/{userId}** - Shopping cart
2. **wishlists/{userId}** - Favorites
3. **notifications/{userId}** - User alerts

---

## 🚀 Performance Tips

1. **Use Indexes**: All composite queries need indexes
2. **Limit Reads**: Use pagination for large lists
3. **Cache Data**: Store frequently accessed data in state
4. **Batch Writes**: Use batch operations for multiple updates
5. **Optimize Queries**: Query only needed fields

---

**📚 For detailed field definitions, see `DATABASE_SCHEMA.md`**
