import Vue from 'vue'
import Vuex from 'vuex'

import ReadyUpSDK from 'ready-up-sdk'
import httpConnector from 'ready-up-http-connector'

const readyUpSDK = httpConnector(ReadyUpSDK, { apiURL: 'https://localhost:3000' })

console.log(readyUpSDK)

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,
    viewingUser: null
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user
    },
    setViewingUser(state, viewingUser) {
      state.viewingUser = viewingUser
    }
  },
  actions: {
    async createUser ({ dispatch, commit }, userParams) {
      try {
        const newUser = await readyUpSDK.createUser(userParams)
        commit('setCurrentUser', newUser.body)
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
    }
  }
})
