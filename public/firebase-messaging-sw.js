importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyArnskgt7UEKM4NUOTzsfT4LiGuwFaKuEM",
  authDomain: "mealy-c2981.firebaseapp.com",
  projectId: "mealy-c2981",
  storageBucket: "mealy-c2981.firebasestorage.app",
  messagingSenderId: "606910754335",
  appId: "1:606910754335:web:ab91d3b61982257b436f2a"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});