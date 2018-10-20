import Vue from 'vue'
import Vuex from 'vuex'

import ReadyUpSDK from 'ready-up-sdk'
import httpConnector from 'ready-up-http-connector'

const readyUpSDK = httpConnector(ReadyUpSDK, { apiURL: 'https://localhost:3000' })

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
      } catch (err) {
        throw err
      }
    },
    async getSession ({ dispatch, commit }) {
      try {
        const session = await readyUpSDK.getSession()
        commit('setCurrentSession', session.body)
      } catch (err) {
        throw err
      }
    },
    async createUser ({ dispatch, commit }, userParams) {
      try {
        await readyUpSDK.createUser(userParams)
        // commit('setCurrentUser', newUser.body)
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
    }
  }
})
