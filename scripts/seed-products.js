const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const PRODUCTS = [
    {
        id: '1',
        name: 'MacBook Pro 16" M3 Max',
        category: 'laptops', // map to 'laptops' id
        category_code: 'Computers/Laptops',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000',
        specs: '36GB RAM, 1TB SSD',
        rating: 4.9,
        brand: 'Apple',
        description: 'The most powerful MacBook Pro ever. Blazing fast M3 Max chip, stunning Liquid Retina XDR display, and all-day battery life.',
        specifications: { RAM: '36GB', Storage: '1TB', Processor: 'M3 Max', Display: '16-inch' }
    },
    {
        id: '2',
        name: 'Dell XPS 13 Plus',
        category: 'laptops',
        category_code: 'Computers/Laptops',
        price: 1499,
        image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=1000',
        specs: '16GB RAM, 512GB SSD',
        rating: 4.5,
        brand: 'Dell',
        description: 'Design that dazzles. The XPS 13 Plus looks as good as it performs with a sleek, minimalist design.',
        specifications: { RAM: '16GB', Storage: '512GB', Processor: 'Intel Core i7', Display: '13.4-inch OLED' }
    },
    {
        id: '3',
        name: 'iPhone 15 Pro Max',
        category: 'phones',
        category_code: 'Electronics/Phones',
        price: 1199,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000',
        specs: '256GB, Titanium',
        rating: 4.8,
        brand: 'Apple',
        description: 'Forged in titanium. The iPhone 15 Pro Max features the A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
        specifications: { Storage: '256GB', Material: 'Titanium', Processor: 'A17 Pro', Camera: '48MP Main' }
    },
    {
        id: '4',
        name: 'Sony WH-1000XM5',
        category: 'accessories',
        category_code: 'Electronics/Audio',
        price: 348,
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000',
        specs: 'Noise Cancelling',
        rating: 4.7,
        brand: 'Sony',
        description: 'Industry-leading noise cancellation. Exceptional sound quality and crystal-clear hands-free calling.',
        specifications: { Type: 'Over-ear', Feature: 'Noise Cancelling', Battery: '30 hours' }
    },
    {
        id: '5',
        name: 'Gaming Desktop RTX 4090',
        category: 'desktops',
        category_code: 'Computers/Desktops',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000',
        specs: 'i9-14900K, 64GB RAM',
        rating: 5.0,
        brand: 'Alienware',
        description: 'Dominate the game with the ultimate gaming desktop. Features the powerful RTX 4090 and massive liquid cooling.',
        specifications: { CPU: 'i9-14900K', RAM: '64GB', GPU: 'RTX 4090', Storage: '2TB NVMe' }
    },
    {
        id: '6',
        name: 'Samsung Galaxy S24 Ultra',
        category: 'phones',
        category_code: 'Electronics/Phones',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=1000',
        specs: '512GB, AI Features',
        rating: 4.8,
        brand: 'Samsung',
        description: 'Galaxy AI is here. Unleash new levels of creativity, productivity, and possibility.',
        specifications: { Storage: '512GB', Processor: 'Snapdragon 8 Gen 3', Camera: '200MP' }
    },
    {
        id: '7',
        name: 'iPad Pro 12.9"',
        category: 'tablets',
        category_code: 'Electronics/tablets',
        price: 1099,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000',
        specs: 'M2 Chip, Liquid Retina XDR',
        rating: 4.9,
        brand: 'Apple',
        description: 'The ultimate iPad experience. With the M2 chip, 12.9-inch Liquid Retina XDR display, and superfast 5G.',
        specifications: { Chip: 'M2', Display: '12.9-inch XDR', Storage: '128GB' }
    }
];

async function seedProducts() {
    console.log('🌱 Seeding products to Firestore...');

    for (const p of PRODUCTS) {
        const productData = {
            title: p.name, // Mapping 'name' to 'title'
            short_description: p.description,
            category_code: p.category_code,
            brand: p.brand,
            main_image_url: p.image,
            specifications: p.specifications,
            offer: {
                price: p.price,
                quantity: 50,
                sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                state: 'New'
            },
            stats: {
                rating: p.rating,
                reviewCount: Math.floor(Math.random() * 100),
                views: 0,
                sales: 0
            },
            status: 'active',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        // Use specific ID or auto-gen. Here we verify if exists first to avoid dupes if run twice
        // For simplicity, we just add.
        await db.collection('products').add(productData);
        console.log(`  ✓ Added ${p.name}`);
    }

    console.log('✅ Seeding complete!');
}

seedProducts().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
