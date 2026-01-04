import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate configuration
const isConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

import { getAnalytics, isSupported } from "firebase/analytics";

// Initialize Firebase only if config is valid to prevent build-time crashes (e.g. on Vercel/Firebase build workers)
let app: any;
let auth: any;
let db: any;

try {
    if (isConfigValid) {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);
    } else {
        if (typeof window !== 'undefined') {
            console.warn("Firebase configuration is missing or invalid:");
            console.log("- API Key:", firebaseConfig.apiKey ? "Present" : "MISSING");
            console.log("- Project ID:", firebaseConfig.projectId ? "Present" : "MISSING");
            console.log("If you just added these to Vercel, you MUST manually trigger a 'REDEPLOY' for them to take effect.");
        }
        // Export placeholders for build time
        app = {} as any;
        auth = {} as any;
        db = {} as any;
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

let analytics;
if (typeof window !== "undefined" && isConfigValid) {
    isSupported().then((supported) => {
        if (supported && app) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, auth, db, analytics };
