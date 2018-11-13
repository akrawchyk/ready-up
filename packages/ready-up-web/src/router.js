import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Users from './views/Users.vue'
import Lobbies from './views/Lobbies.vue'
import store from './store'

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
          component: () => import(/* webpackChunkName: "lobbiesEdit" */ './views/LobbiesEdit.vue')
        },
        {
          path: '/lobbies/:lobbyId',
          name: 'lobbiesShow',
          component: () => import(/* webpackChunkName: "lobbiesShow" */ './views/LobbiesShow.vue')
        }
      ],
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.currentSession) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
        replace: true
      })
      return
    }
  }

  next()
})

export default router
