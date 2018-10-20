import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase/app'
import 'firebase/messaging'

import ReadyUpSDK from 'ready-up-sdk'
import httpConnector from 'ready-up-http-connector'

const readyUpSDK = httpConnector(ReadyUpSDK, { apiURL: 'https://localhost:3000' })

firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID
})

const messaging = firebase.messaging()
messaging.usePublicVapidKey(process.env.VUE_APP_FIREBASE_PUBLIC_VAPID_KEY)
messaging.onTokenRefresh(async () => {
  try {
    const refreshedToken = await messaging.getToken()
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    // setTokenSentToServer(false);
    // Send Instance ID token to app server.
    await readyUpSDK.updateUser({
      id: state.currentSession.userId,
      firebaseMessagingToken: currentToken
    })
  } catch (err) {
    console.log('Unable to retrieve refreshed token ', err)
    // showToken('Unable to retrieve refreshed token ', err);
  }
})
messaging.onMessage(function (payload) {
  // TODO receive a message
  console.log('Message received: ', payload)
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentSession: null,
    viewingUser: null,
    currentLobby: null
  },
  mutations: {
    setCurrentSession(state, session) {
      state.currentSession = session
    },
    setViewingUser(state, viewingUser) {
      state.viewingUser = viewingUser
    },
    setCurrentLobby(state, lobby) {
      state.currentLobby = lobby
    }
  },
  actions: {
    async createSession ({ dispatch, commit }, sessionParams) {
      try {
        const newSession = await readyUpSDK.createSession(sessionParams)
        commit('setCurrentSession', newSession.body)
        return dispatch('requestNotificationPermission')
      } catch (err) {
        throw err
      }
    },
    async getSession ({ dispatch, commit }) {
      try {
        const session = await readyUpSDK.getSession()
        commit('setCurrentSession', session.body)
        // FIXME only request if dont have token
        return dispatch('requestNotificationPermission')
      } catch (err) {
        throw err
      }
    },
    async createUser ({ dispatch, commit }, userParams) {
      try {
        await readyUpSDK.createUser(userParams)
        return dispatch('requestNotificationPermission')
        // commit('setCurrentUser', newUser.body)
      } catch (err) {
        throw err
      }
    },
    async updateUser ({ state, dispatch, commit }, { firebaseMessagingToken }) {
      try {
        return await readyUpSDK.updateUser({
          id: state.currentSession.userId,
          firebaseMessagingToken
        })
      } catch (err) {
        throw err
      }
    },
    async getUser ({ dispatch, commit }, userQuery) {
      try {
        const viewingUser = await readyUpSDK.getUser(userQuery)
        commit('setViewingUser', viewingUser.body)
      } catch (err) {
        throw err
      }
    },
    async createLobby ({ dispatch, commit }, lobbyParams) {
      try {
        const newLobby = await readyUpSDK.createLobby(lobbyParams)
        commit('setCurrentLobby', newLobby.body)
      } catch (err) {
        throw err
      }
    },

    // firebase below

    async requestNotificationPermission ({ state, dispatch, commit }) {
      try {
        await messaging.requestPermission()
      } catch (err) {
        console.log('Unable to get permission to notify.', err)
        dispatch('updateUser', { firebaseMessagingToken: '' })
        throw err
      }

      try {
        const currentToken = await messaging.getToken()

        if (currentToken) {
          dispatch('updateUser', { firebaseMessagingToken: currentToken })
          // updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log('No Instance ID token available. Request permission to generate one.');
          // // Show permission UI.
          // updateUIForPushPermissionRequired()
          // setTokenSentToServer(false)
          dispatch('updateUser', { firebaseMessagingToken: '' })
        }
      } catch (err) {
        throw err
      }
    }
  }
})
