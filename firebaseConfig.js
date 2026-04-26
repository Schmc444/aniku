// firebaseConfig.js
// Configuración de Firebase para Aniku Mobile App

import { initializeApp, getApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseEnv = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY?.trim() || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID?.trim() || "",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() || "",
};

const firebaseEnvPairs = [
  ["EXPO_PUBLIC_FIREBASE_API_KEY", firebaseEnv.apiKey],
  ["EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN", firebaseEnv.authDomain],
  ["EXPO_PUBLIC_FIREBASE_PROJECT_ID", firebaseEnv.projectId],
  ["EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET", firebaseEnv.storageBucket],
  ["EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", firebaseEnv.messagingSenderId],
  ["EXPO_PUBLIC_FIREBASE_APP_ID", firebaseEnv.appId],
];

function readEnv(value, name, required = true) {
  if (!required) {
    return value || undefined;
  }

  if (value.length === 0) {
    throw new Error(
      `[firebaseConfig] Missing env var ${name}. Create a .env file based on .env.example.`,
    );
  }

  return value;
}

const missingFirebaseEnvVars = firebaseEnvPairs
  .filter(([, value]) => value.length === 0)
  .map(([name]) => name);

// Flag to track if Firebase is properly configured
export const isFirebaseConfigured = missingFirebaseEnvVars.length === 0;

// 🔥 Firebase configuration (customizable via .env)
let firebaseConfig = null;
let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  firebaseConfig = {
    apiKey: readEnv(firebaseEnv.apiKey, "EXPO_PUBLIC_FIREBASE_API_KEY"),
    authDomain: readEnv(firebaseEnv.authDomain, "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnv(firebaseEnv.projectId, "EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv(firebaseEnv.storageBucket, "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv(
      firebaseEnv.messagingSenderId,
      "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    ),
    appId: readEnv(firebaseEnv.appId, "EXPO_PUBLIC_FIREBASE_APP_ID"),
    measurementId: readEnv(firebaseEnv.measurementId, "EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID", false),
  };

  // 🚀 Initialize Firebase
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

  function createAuth() {
    try {
      return initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      return getAuth(app);
    }
  }

  // 🔐 Initialize Firebase Authentication (con persistencia en AsyncStorage)
  auth = createAuth();

  // 🗄️ Initialize Firestore
  db = getFirestore(app);
} else {
  console.warn(
    "[firebaseConfig] ⚠️  Firebase not configured. Cloud features will not work.\n" +
      `Missing vars: ${missingFirebaseEnvVars.join(", ")}\n` +
      "See FIREBASE_SETUP.md for instructions.",
  );
}

// Backwards-compatible exports
export { db, auth, app };

// Also export getter functions for safety checks
export const getFirebaseApp = () => app;
export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;

// 📊 Initialize Analytics (only on web platform)
let analytics = null;
if (typeof window !== "undefined" && app) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("📊 Firebase Analytics inicializado");
    }
  });
}
export { analytics };

// 📊 Enable offline persistence (opcional)
// import { enableNetwork, disableNetwork } from 'firebase/firestore';
// export { enableNetwork, disableNetwork };

if (app && firebaseConfig) {
  console.log("🔥 Firebase inicializado correctamente:", app.name);
  console.log("🎯 Proyecto ID:", firebaseConfig.projectId);
}
