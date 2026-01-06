const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const USER_UID = 'nzlrWnOehNgtkcoROTpO9e2MrIj2'; // The specific UID provided

async function setAdminRole() {
    console.log(`🔍 Updating user ${USER_UID} to admin role...`);

    // Check both 'users' and 'user' collections just in case
    const collections = ['users', 'user'];

    for (const col of collections) {
        const userRef = db.collection(col).doc(USER_UID);
        const doc = await userRef.get();

        if (doc.exists) {
            await userRef.update({
                role: 'admin',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`✅ Updated existing document in '${col}' collection.`);
        } else {
            // Create if doesn't exist (ensure data integrity)
            await userRef.set({
                uid: USER_UID,
                email: 'admin@laptek.com', // Placeholder if we don't know it, usually Auth handles this
                role: 'admin',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log(`✨ Created new admin document in '${col}' collection.`);
        }
    }

    console.log('\n🎉 User is now an ADMIN. Access should be granted immediately.');
}

setAdminRole().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
