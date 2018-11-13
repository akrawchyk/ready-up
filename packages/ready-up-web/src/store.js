import Vue from 'vue'
import Vuex from 'vuex'

import ReadyUpSDK from 'ready-up-sdk'
import httpConnector from 'ready-up-http-connector'

// FIXME configurable api url from environment at build time
const readyUpSDK = httpConnector(ReadyUpSDK, {
  apiURL: 'https://ready-up.test:3000'
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentSession: null,
    viewingUser: null,
    currentLobby: null,
    lobbies: []
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
    },
    setLobbies(state, lobbies) {
      state.lobbies = lobbies
    }
  },
  actions: {
    async createSession({ dispatch, commit }, sessionParams) {
      try {
        const newSession = await readyUpSDK.createSession(sessionParams)
        commit('setCurrentSession', newSession.body)
      } catch (err) {
        throw err
      }
    },
    async getSession({ dispatch, commit }) {
      try {
        const session = await readyUpSDK.getSession()
        commit('setCurrentSession', session.body)
      } catch (err) {
        throw err
      }
    },
    async createUser({ dispatch, commit }, userParams) {
      try {
        await readyUpSDK.createUser(userParams)
        // commit('setCurrentUser', newUser.body)
      } catch (err) {
        throw err
      }
    },
    async updateUser({ state, dispatch, commit }, { firebaseMessagingToken }) {
      try {
        return await readyUpSDK.updateUser({
          id: state.currentSession.userId,
          firebaseMessagingToken
        })
      } catch (err) {
        throw err
      }
    },
    async getUser({ dispatch, commit }, userQuery) {
      try {
        const viewingUser = await readyUpSDK.getUser(userQuery)
        commit('setViewingUser', viewingUser.body)
      } catch (err) {
        throw err
      }
    },
    async createLobby({ dispatch, commit }, lobbyParams) {
      try {
        const newLobby = await readyUpSDK.createLobby(lobbyParams)
        commit('setCurrentLobby', newLobby.body)
      } catch (err) {
        throw err
      }
    },
    async queryLobbies({ commit }) {
      try {
        const lobbies = await readyUpSDK.queryLobbies()
        console.log(lobbies)
        commit('setLobbies', lobbies.body)
      } catch (err) {
        throw err
      }
    },
    async updateLobbyMember({ dispatch, commit }, { id, ready }) {
      try {
        // TODO set the lobby member's status
        return await readyUpSDK.updateLobbyMember({
          id,
          ready
        })
      } catch (err) {
        throw err
      }
    },
    // FIXME should this be query? we want to get 4 calls or so...
    async getLobbyMember({ dispatch, commit }, lobbyMemberQuery) {
      try {
        // FIXME do we need to use the result.body?
        return await readyUpSDK.getLobbyMember(lobbyMemberQuery)
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  },
  getters: {
    currentSession(state) {
      return state.currentSession
    },
    currentLobby(state) {
      return state.currentLobby
    },
    viewingUser(state) {
      return state.viewingUser
    },
    lobbies(state) {
      return state.lobbies
    }
  }
})
