/**
 * Database Initialization Script
 * Run this once to set up initial collections and sample data
 * 
 * Usage: node scripts/init-database.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // You'll need to download this from Firebase Console

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initializeDatabase() {
    console.log('🚀 Starting database initialization...\n');

    try {
        // 1. Create Site Settings
        await createSiteSettings();

        // 2. Create Sample Categories
        await createCategories();

        // 3. Create Sample Products (optional)
        // await createSampleProducts();

        // 4. Create Marketplace Settings
        await createMarketplaceSettings();

        console.log('\n✅ Database initialization complete!');
        console.log('\n📝 Next steps:');
        console.log('1. Create your admin user in Firebase Console');
        console.log('2. Deploy Firestore rules: firebase deploy --only firestore:rules');
        console.log('3. Create required indexes in Firebase Console');

    } catch (error) {
        console.error('❌ Error initializing database:', error);
    }
}

async function createSiteSettings() {
    console.log('📄 Creating site settings...');

    const settings = {
        general: {
            siteName: 'Laptek',
            siteUrl: 'https://laptek.vercel.app',
            supportEmail: 'support@laptek.com',
            currency: 'CAD',
            timezone: 'America/Toronto',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        shipping: {
            rates: [
                { region: 'ON', rate: 10, freeShippingThreshold: 50 },
                { region: 'QC', rate: 12, freeShippingThreshold: 50 },
                { region: 'BC', rate: 15, freeShippingThreshold: 75 },
                { region: 'AB', rate: 15, freeShippingThreshold: 75 }
            ],
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        payment: {
            methods: ['credit_card', 'paypal', 'stripe'],
            taxRate: 0.13, // 13% HST for Ontario
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }
    };

    for (const [key, value] of Object.entries(settings)) {
        await db.collection('site_settings').doc(key).set(value);
        console.log(`  ✓ Created ${key} settings`);
    }
}

async function createCategories() {
    console.log('\n📦 Creating product categories...');

    const categories = [
        {
            id: 'laptops',
            name: 'Laptops',
            code: 'Computers/Laptops',
            description: 'Portable computers for work and play',
            requiredFields: ['brand', 'processor', 'ram', 'storage', 'screen_size'],
            active: true
        },
        {
            id: 'desktops',
            name: 'Desktop Computers',
            code: 'Computers/Desktop Computers',
            description: 'Powerful desktop PCs',
            requiredFields: ['brand', 'processor', 'ram', 'storage'],
            active: true
        },
        {
            id: 'monitors',
            name: 'Monitors',
            code: 'Computers/Monitors',
            description: 'Display screens and monitors',
            requiredFields: ['brand', 'screen_size', 'resolution'],
            active: true
        },
        {
            id: 'components',
            name: 'Components',
            code: 'Computers/Components',
            description: 'PC parts and components',
            requiredFields: ['brand', 'type'],
            active: true
        },
        {
            id: 'peripherals',
            name: 'Peripherals',
            code: 'Electronics/Accessories',
            description: 'Keyboards, mice, and accessories',
            requiredFields: ['brand', 'type'],
            active: true
        }
    ];

    for (const category of categories) {
        await db.collection('categories').doc(category.id).set({
            ...category,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`  ✓ Created category: ${category.name}`);
    }
}

async function createMarketplaceSettings() {
    console.log('\n🏪 Creating marketplace settings...');

    const marketplaces = [
        {
            id: 'walmart',
            marketplace: 'walmart',
            enabled: false,
            credentials: {
                apiKey: '',
                apiSecret: '',
                merchantId: ''
            },
            syncSettings: {
                autoSync: false,
                syncInterval: 60
            },
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        {
            id: 'bestbuy',
            marketplace: 'bestbuy',
            enabled: false,
            credentials: {
                apiKey: '',
                apiSecret: '',
                merchantId: ''
            },
            syncSettings: {
                autoSync: false,
                syncInterval: 60
            },
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }
    ];

    for (const marketplace of marketplaces) {
        await db.collection('marketplace_settings').doc(marketplace.id).set(marketplace);
        console.log(`  ✓ Created ${marketplace.marketplace} settings`);
    }
}

async function createSampleProducts() {
    console.log('\n🛍️  Creating sample products...');

    const products = [
        {
            title: { en: 'MacBook Pro 14" M3 Max' },
            short_description: { en: 'Powerful laptop for professionals' },
            category_code: 'Computers/Laptops',
            brand: 'Apple',
            main_image_url: 'https://placehold.co/800x600/000000/white?text=MacBook+Pro',
            specifications: {
                condition: 'New',
                processor_type: 'M3 Max',
                ram_size: 36,
                ssd_capacity: 1024,
                screen_size: 14,
                color: 'Space Black'
            },
            offer: {
                sku: 'MBP-M3-36-1TB',
                price: 3499,
                quantity: 10,
                min_quantity_alert: 2,
                state: 'New',
                warranty_days: 365
            },
            status: 'active',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }
    ];

    for (const product of products) {
        const docRef = await db.collection('products').add(product);
        console.log(`  ✓ Created product: ${product.title.en} (${docRef.id})`);
    }
}

// Run the initialization
initializeDatabase()
    .then(() => {
        console.log('\n✨ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Fatal error:', error);
        process.exit(1);
    });
