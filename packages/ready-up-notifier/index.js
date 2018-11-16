const admin = require('firebase-admin')

// TODO could get pg-connector and run this in a separate process

const serviceAccount = require(process.env.READY_UP_FIREBASE_SERVICE_ACCOUNT_KEY_PATH)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  messagingSenderId: process.env.READY_UP_FIREBASE_MESSAGING_SENDER_ID
})

function createOutbox(notifications) {
  return notifications.map((notification) => {
    return async function sendNotification() {
      if (!notification.token) {
        // dont send to users that aren't accepting notifications
        return Promise.resolve()
      }

      const { data, title, body, token } = notification

      const message = {
        data,
        // https://firebase.google.com/docs/cloud-messaging/admin/send-messages#defining_the_message
        webpush: {
          notification: {
            title,
            body,
            icon: 'https://ready-up.test:8000/img/icons/android-chrome-192x192.png'
            // icon: 'https://ready-up.test:8080/img/icons/android-chrome-192x192.png'
          }
        },
        token
      }

      try {
        const response = await admin.messaging().send(message)
        console.info('Successfully sent message: ', response)
        return response
      } catch (err) {
        console.error('Error sending message:', err)
      }
    }
  })
}

module.exports = {
  send(notifications) {
    const outbox = createOutbox(notifications)
    return Promise.all(outbox.map((send) => send()))
  }
}
