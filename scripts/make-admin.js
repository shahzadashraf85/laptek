/**
 * Make User Admin Script
 * Usage: node scripts/make-admin.js <email>
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const auth = admin.auth();

async function makeAdmin(email) {
    if (!email) {
        console.error('❌ Please provide an email address.');
        console.log('Usage: node scripts/make-admin.js <email>');
        process.exit(1);
    }

    console.log(`🔍 Looking up user: ${email}...`);

    try {
        // 1. Get User from Authentication
        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email);
        } catch (e) {
            console.error(`❌ User not found in Authentication: ${e.message}`);
            return;
        }

        const uid = userRecord.uid;
        console.log(`   Found UID: ${uid}`);

        // 2. Check/Create User Document in Firestore
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.log('   User document not found in Firestore. Creating one...');
            await userRef.set({
                email: email,
                displayName: userRecord.displayName || 'Admin User',
                role: 'admin',
                status: 'active',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Created new admin user document in Firestore.');
        } else {
            console.log('   User document exists. Updating role to admin...');
            await userRef.update({
                role: 'admin',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Updated existing user to admin.');
        }

        // 3. Set Custom Claims (Optional but recommended for robust security)
        await auth.setCustomUserClaims(uid, { role: 'admin' });
        console.log('✅ Set custom claim { role: "admin" } on Auth account.');

        console.log('\n✨ Success! You may need to sign out and sign back in for changes to take effect.');

    } catch (error) {
        console.error('❌ Error making user admin:', error);
    }
}

// Get email from command line args
const targetEmail = process.argv[2];
makeAdmin(targetEmail)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
