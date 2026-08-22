import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0481647261",
  appId: "1:171507059021:web:bba95cbfbd3175638b8f04",
  apiKey: "AIzaSyCMqAw54cQxrlvBMkQlTXCoe5RMgilXXH0",
  authDomain: "gen-lang-client-0481647261.firebaseapp.com",
  storageBucket: "gen-lang-client-0481647261.firebasestorage.app",
  messagingSenderId: "171507059021",
};

// Database ID configured for this project
export const FIRESTORE_DATABASE_ID = "ai-studio-crisischainai-c6346503-2d73-4f83-8504-bd58270bf62b";

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with specific database ID if supported, or default
export const db = getFirestore(app, FIRESTORE_DATABASE_ID);
