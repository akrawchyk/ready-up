importScripts('https://www.gstatic.com/firebasejs/5.5.5/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.5.5/firebase-messaging.js')

firebase.initializeApp({
  apiKey: 'AIzaSyAiuR85LRVjXMiDoWY-CyzrrvdYEETYDLc',
  messagingSenderId: '751484056905'
})

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: '/img/icons/android-chrome-192x192.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions)
})
