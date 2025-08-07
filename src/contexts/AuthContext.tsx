import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, User as FirebaseUser } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider } from "@/lib/firebase";
import { db } from "@/lib/firebase";

interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signInWithGoogle: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const fetchUserFromFirestore = async (uid: string) => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser({
          id: userDoc.id,
          name: userDoc.data().name,
          email: userDoc.data().email,
          joinedAt: userDoc.data().joinedAt,
        });
      }
    };
    const storedUser = localStorage.getItem('skillswap_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Try to fetch latest user profile from Firestore
        if (parsedUser.id) fetchUserFromFirestore(parsedUser.id);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('skillswap_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation (in real app, this would be server-side)
    if (email && password.length >= 6) {
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0], // Use email prefix as name for simulation
        email,
        joinedAt: new Date().toISOString(),
      };
      
      setUser(userData);
      localStorage.setItem('skillswap_user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation
    if (name && email && password.length >= 6) {
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        joinedAt: new Date().toISOString(),
      };
      
      setUser(userData);
      localStorage.setItem('skillswap_user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillswap_user');
    // Redirect to homepage
    window.location.href = '/';
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser: FirebaseUser = result.user;
      // Create or update user in Firestore
      const userRef = doc(db, "users", firebaseUser.uid);
      const userData = {
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        email: firebaseUser.email || "",
        joinedAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        timestamp: serverTimestamp(),
      };
      await setDoc(userRef, userData, { merge: true });
      // Set user in state/localStorage
      setUser({
        id: firebaseUser.uid,
        name: userData.name,
        email: userData.email,
        joinedAt: userData.joinedAt,
      });
      localStorage.setItem('skillswap_user', JSON.stringify({
        id: firebaseUser.uid,
        name: userData.name,
        email: userData.email,
        joinedAt: userData.joinedAt,
      }));
      return true;
    } catch (error) {
      console.error("Google sign-in failed", error);
      return false;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};