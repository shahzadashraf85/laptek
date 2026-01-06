# Database Setup Guide

## 🎯 Overview
This guide will help you set up the complete Firestore database for your Laptek e-commerce application.

---

## 📋 Prerequisites

1. **Firebase Project** - You should already have one
2. **Firebase CLI** (optional for deployment)
3. **Admin Access** to Firebase Console

---

## 🚀 Quick Setup Steps

### Step 1: Deploy Firestore Security Rules

**Option A: Using Firebase Console (Recommended)**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Copy the contents of `firestore.rules` from this project
5. Paste into the Firebase Console editor
6. Click **Publish**

**Option B: Using Firebase CLI**
```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

---

### Step 2: Create Required Indexes

Go to **Firestore Database** → **Indexes** → **Composite** and create these indexes:

#### Products Collection
- Collection: `products`
  - Fields: `status` (Ascending), `createdAt` (Descending)
  
- Collection: `products`
  - Fields: `category_code` (Ascending), `status` (Ascending), `createdAt` (Descending)

#### Orders Collection
- Collection: `orders`
  - Fields: `userId` (Ascending), `createdAt` (Descending)
  
- Collection: `orders`
  - Fields: `status` (Ascending), `createdAt` (Descending)

#### Support Conversations
- Collection: `support_conversations`
  - Fields: `userId` (Ascending), `updatedAt` (Descending)
  
- Collection: `support_conversations`
  - Fields: `status` (Ascending), `updatedAt` (Descending)

#### Notifications
- Collection: `notifications`
  - Fields: `userId` (Ascending), `read` (Ascending), `createdAt` (Descending)

---

### Step 3: Create Your Admin User

1. **Sign up** through your app at `/signup`
2. Note your **User UID** from Firebase Console → Authentication
3. Go to **Firestore Database** → **Data**
4. Navigate to the `users` collection
5. Find your user document (or create it if it doesn't exist)
6. Edit the document and set:
   ```json
   {
     "email": "your-email@example.com",
     "displayName": "Your Name",
     "role": "admin",
     "status": "active",
     "createdAt": <current timestamp>,
     "updatedAt": <current timestamp>
   }
   ```

---

### Step 4: Initialize Database (Optional)

If you want to set up initial data:

1. **Download Service Account Key**:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in project root
   - **⚠️ IMPORTANT**: Add to `.gitignore` (already done)

2. **Install Dependencies**:
   ```bash
   npm install firebase-admin
   ```

3. **Run Initialization Script**:
   ```bash
   node scripts/init-database.js
   ```

This will create:
- Site settings (general, shipping, payment)
- Product categories
- Marketplace settings (Walmart, Best Buy)

---

## 📊 Database Collections

Your database now includes these collections:

### Core Collections
- ✅ **users** - User accounts and profiles
- ✅ **products** - Product catalog
- ✅ **orders** - Customer orders
- ✅ **invoices** - Sales and purchase invoices

### E-commerce Features
- ✅ **carts** - Shopping carts
- ✅ **wishlists** - User favorites
- ✅ **promotions** - Discount codes and coupons

### Customer Support
- ✅ **support_conversations** - Customer support inbox
- ✅ **notifications** - User notifications

### Admin & Analytics
- ✅ **marketplace_settings** - Walmart/Best Buy integration
- ✅ **sync_logs** - Marketplace sync history
- ✅ **analytics** - Business metrics
- ✅ **sales_stats** - Sales statistics
- ✅ **site_settings** - Global configuration

---

## 🔒 Security Rules Summary

The deployed rules ensure:

- ✅ **Public** can read products and check promotions
- ✅ **Authenticated users** can:
  - Read/write their own cart, wishlist, and profile
  - Create orders
  - View their own orders and invoices
  - Create support conversations
  
- ✅ **Admins** can:
  - Full CRUD on products, orders, invoices
  - Manage promotions and marketplace settings
  - Access analytics and sales stats
  - Manage all support conversations

---

## 📖 Documentation

- **Full Schema**: See `DATABASE_SCHEMA.md` for detailed collection structures
- **Security Rules**: See `firestore.rules` for complete access control logic

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Firestore rules deployed successfully
- [ ] All required indexes created
- [ ] Admin user created with `role: "admin"`
- [ ] Can login to admin panel at `/admin`
- [ ] Can create a test product
- [ ] Products appear on storefront

---

## 🆘 Troubleshooting

### "Permission Denied" Errors
- Check that Firestore rules are deployed
- Verify user has correct `role` in Firestore
- Check browser console for detailed error messages

### "Missing Index" Errors
- Create the required composite index in Firebase Console
- Wait a few minutes for index to build

### Admin Panel Won't Load
- Verify your user document has `role: "admin"`
- Check both `users` and `user` collections (legacy support)
- Clear browser cache and try again

---

## 🔄 Next Steps

1. **Test the Database**:
   - Create a product in admin panel
   - Place a test order as a customer
   - Try the support chat

2. **Configure Marketplace Integration**:
   - Add API keys in `marketplace_settings` collection
   - Test price checking feature

3. **Customize Settings**:
   - Update site settings in `site_settings` collection
   - Configure shipping rates for your regions

---

## 📞 Need Help?

If you encounter issues:
1. Check Firebase Console → Firestore → Usage for error logs
2. Review `DATABASE_SCHEMA.md` for collection structure
3. Verify security rules match your use case

---

**🎉 Your database is now ready for production!**
