import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, requestNotificationPermission } from '../firebase-config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const fcmToken = await requestNotificationPermission();
        if (fcmToken) {
          console.log('FCM Token:', fcmToken);
        }
      }
      setLoading(false);
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative w-72 text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-2xl bg-neutral-800/80 backdrop-blur-xl animate-pulse"></div>
            <div className="absolute inset-0 rounded-2xl border border-neutral-700/50 animate-ping" style={{ animationDuration: '2s' }}></div>
          </div>
          <h1 className="text-2xl font-semibold text-white opacity-80">Mealy A7</h1>
          <p className="text-sm text-neutral-400">Setting up your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);