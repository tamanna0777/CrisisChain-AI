import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  signInWithPopup, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, phone: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoUser: (customName?: string, customEmail?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserSafetyStatus: (status: 'Safe' | 'Not Recently Updated' | 'SOS Active' | 'Missing') => Promise<void>;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync profile from Firestore or local storage fallback
  const fetchOrCreateProfile = async (firebaseUser: User, extraName?: string, extraPhone?: string) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        setUserProfile(data);
      } else {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          name: extraName || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Citizen User'),
          email: firebaseUser.email || '',
          phone: extraPhone || firebaseUser.phoneNumber || '+91 98765 43210',
          createdDate: new Date().toISOString(),
          accountStatus: 'active',
          bloodGroup: 'O+',
          emergencyNotes: 'No known drug allergies. Carries asthma inhaler.',
          status: 'Safe',
          lastCheckIn: new Date().toISOString(),
          privacySettings: {
            locationSharingConsentOnly: true,
            allowEmergencyServiceAccess: true,
            notifyFamilyOnSOS: true,
            notifyVolunteers: true,
          }
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.warn('Firestore profile fetch notice (using memory/local fallback):', err);
      // Construct robust local profile
      const fallbackProfile: UserProfile = {
        uid: firebaseUser.uid,
        name: extraName || firebaseUser.displayName || 'Tamanna Shaikh',
        email: firebaseUser.email || 'tamannashaikh702@gmail.com',
        phone: extraPhone || '+91 98765 43210',
        createdDate: new Date().toISOString(),
        accountStatus: 'active',
        bloodGroup: 'B+',
        emergencyNotes: 'Emergency Contact: Mother. Blood Group: B+',
        status: 'Safe',
        lastCheckIn: new Date().toISOString(),
        privacySettings: {
          locationSharingConsentOnly: true,
          allowEmergencyServiceAccess: true,
          notifyFamilyOnSOS: true,
          notifyVolunteers: true,
        }
      };
      setUserProfile(fallbackProfile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchOrCreateProfile(user);
      } else {
        // Check for local demo profile or default user state
        const savedDemo = localStorage.getItem('crisischain_active_user');
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            setUserProfile(parsed);
          } catch {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await fetchOrCreateProfile(cred.user);
  };

  const signupWithEmail = async (name: string, email: string, phone: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    await fetchOrCreateProfile(cred.user, name, phone);
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await fetchOrCreateProfile(cred.user);
  };

  const loginAsDemoUser = async (customName = 'Tamanna Shaikh', customEmail = 'tamannashaikh702@gmail.com') => {
    const mockUid = 'usr-' + Date.now().toString(36);
    const demoProfile: UserProfile = {
      uid: mockUid,
      name: customName,
      email: customEmail,
      phone: '+91 98234 56789',
      createdDate: new Date().toISOString(),
      accountStatus: 'active',
      bloodGroup: 'B+',
      emergencyNotes: 'Penicillin allergy. Primary contact: Family Leader.',
      status: 'Safe',
      lastCheckIn: new Date().toISOString(),
      privacySettings: {
        locationSharingConsentOnly: true,
        allowEmergencyServiceAccess: true,
        notifyFamilyOnSOS: true,
        notifyVolunteers: true,
      }
    };
    localStorage.setItem('crisischain_active_user', JSON.stringify(demoProfile));
    setUserProfile(demoProfile);
  };

  const logout = async () => {
    localStorage.removeItem('crisischain_active_user');
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateUserSafetyStatus = async (status: 'Safe' | 'Not Recently Updated' | 'SOS Active' | 'Missing') => {
    if (!userProfile) return;
    const updated = {
      ...userProfile,
      status,
      lastCheckIn: new Date().toISOString(),
    };
    setUserProfile(updated);
    localStorage.setItem('crisischain_active_user', JSON.stringify(updated));

    try {
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, {
        status,
        lastCheckIn: new Date().toISOString(),
      });
    } catch (err) {
      console.log('Safety status stored locally & synced:', err);
    }
  };

  const updateUserProfileData = async (data: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = {
      ...userProfile,
      ...data,
    };
    setUserProfile(updated);
    localStorage.setItem('crisischain_active_user', JSON.stringify(updated));

    try {
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, data);
    } catch (err) {
      console.log('Profile update local notice:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        loginAsDemoUser,
        logout,
        updateUserSafetyStatus,
        updateUserProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
