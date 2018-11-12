import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Users from './views/Users.vue'
import Lobbies from './views/Lobbies.vue'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/users',
      name: '',
      // component: () => import(/* webpackChunkName: "users" */'./views/Users.vue'),
      component: Users,
      children: [
        {
          path: '',
          name: 'usersHome',
          component: () => import(/* webpackChunkName: "usersHome" */ './views/UsersHome.vue')
        },
        {
          path: '/users/new',
          name: 'usersCreate',
          component: () => import(/* webpackChunkName: "usersEdit" */ './views/UsersEdit.vue')
        },
        {
          path: '/users/:userId',
          name: 'usersShow',
          component: () => import(/* webpackChunkName: "usersShow" */ './views/UsersShow.vue')
        }
      ]
    },
    {
      path: '/lobbies',
      name: '',
      // component: () => import(/* webpackChunkName: "lobbies" */'./views/Lobbies.vue'),
      component: Lobbies,
      children: [
        {
          path: '',
          name: 'lobbiesHome',
          component: () => import(/* webpackChunkName: "lobbiesHome" */ './views/LobbiesHome.vue')
        },
        {
          path: '/lobbies/new',
          name: 'lobbiesCreate',
          component: () => import(/* webpackChunkName: "lobbiesEdit" */ './views/LobbiesEdit.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/lobbies/:lobbyId',
          name: 'lobbiesShow',
          component: () => import(/* webpackChunkName: "lobbiesShow" */ './views/LobbiesShow.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    // FIXME some way to identify a current session outside of vuex
    // could use local storage to set the last logged in timestamp, we have http only cookies
    if (!this.currentSession) {
      console.log('uh oh, no session!')
      next({
        path: '/login',
        query: { redirect: to.fullPath },
        replace: true
      })
      console.log('return')
      return
    }
  }

  next()
})

export default router
