<template>
  <div id="firebase-messaging">
    <code>
      {{ log }}
    </code>
  </div>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/messaging'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'FirebaseMessaging',
  data () {
    return {
      messaging: null,
      log: []
    }
  },
  computed: {
    ...mapState({
      session: state => state.currentSession
    })
  },
  methods: {
    ...mapActions([
      'updateUser'
    ])
  },
  watch: {
    async session (newSession) {
      try {
        await this.messaging.requestPermission()
      } catch (err) {
        console.log('Unable to get permission to notify.', err)
        this.updateUser({ firebaseMessagingToken: '' })
        throw err
      }

      try {
        const currentToken = await this.messaging.getToken()

        if (currentToken) {
          this.updateUser({ firebaseMessagingToken: currentToken })
          // updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log('No Instance ID token available. Request permission to generate one.');
          // // Show permission UI.
          // updateUIForPushPermissionRequired()
          // setTokenSentToServer(false)
          this.updateUser({ firebaseMessagingToken: '' })
        }
      } catch (err) {
        console.log(err)
        throw err
      }
    }
  },
  created () {
    firebase.initializeApp({
      apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
      messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID
    })

    this.messaging = firebase.messaging()
    this.messaging.usePublicVapidKey(process.env.VUE_APP_FIREBASE_PUBLIC_VAPID_KEY)

    this.messaging.onTokenRefresh(async () => {
      try {
        const refreshedToken = await this.messaging.getToken()
        console.log('Token refreshed.');
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        // setTokenSentToServer(false);
        // Send Instance ID token to app server.
        this.updateUser({ firebaseMessagingToken: refreshedToken })
      } catch (err) {
        console.log('Unable to retrieve refreshed token ', err)
        // showToken('Unable to retrieve refreshed token ', err);
      }
    })

    this.messaging.onMessage((payload) => {
      this.log.push(payload)
      console.log('Message received: ', payload)
    })
  }
}
</script>
