const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

async function testAdd() {
    console.log("Attempting to add a test product...");
    const productData = {
        title: { en: "Test Product Manual Script 2" },
        short_description: { en: "This is a test description" },
        category_code: "Electronics/Laptops",
        brand: "TestBrand",
        main_image_url: "https://placehold.co/400",
        offer: {
            price: 199.99,
            quantity: 10,
            sku: "TEST-SKU-002",
            state: "New",
            min_quantity_alert: 5
        },
        specifications: {
            processor: "Test Processor",
            ram: "16GB",
            condition: "New"
        },
        status: "active",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
        const docRef = await db.collection('products').add(productData);
        console.log("✅ SUCCESS: Product added with ID:", docRef.id);
    } catch (e) {
        console.error("❌ FAILED: Error adding product:", e);
    }
}

testAdd();
