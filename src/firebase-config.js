import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import {  getToken } from 'firebase/messaging'; 


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
    try {
      // First check if messaging is supported
      if (!messaging) {
        throw new Error('Firebase messaging not supported');
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: 'BBFCWK1qJlJZ5vgGKhBZNJp2dnC2ReDJaXVoHnULL12pxvJowS9UliuGWArcnKmtsqhh20DkWWjHqbDcOcU4Tyg' 
        });
        if (!token) {
          throw new Error('No registration token available');
        }
        return token;
      } else {
        throw new Error('Permission not granted for notifications');
      }
    } catch (error) {
      console.error('Error getting notification permission:', error);
      return null;
    }
};
  
export default app;