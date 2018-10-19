// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
// importScripts('https://www.gstatic.com/firebasejs/5.5.4/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/5.5.4/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '751484056905'
});
const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: '/img/icons/android-chrome-192x192.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
