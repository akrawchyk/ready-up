/* eslint-disable no-console */

import { register } from 'register-service-worker'
import * as firebase from 'firebase/app'
import 'firebase/messaging'

if (process.env.NODE_ENV === 'production') {
  registration = register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered (registration) {
      // TODO load firebase
      firebase.initializeApp({
        'messagingSenderId': process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID
      })
      firebase.useServiceWorker(registration)

      const messaging = firebase.messaging()
      // messaging.usePublicVapidKey(process.env.VUE_APP_FIREBASE_PUBLIC_VAPID_KEY)
      messaging.setBackgroundMessageHandler(function(payload) {
        console.log('[firebase-messaging] Received background message ', payload)
        var notificationTitle = 'Background Message Title';
        var notificationOptions = {
          body: 'Background Message body.',
          icon: '/img/icons/android-chrome-192x192.png'
        };

        return registration.showNotification(notificationTitle, notificationOptions)
      })
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
