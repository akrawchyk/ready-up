import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Users from './views/Users.vue'
import Lobbies from './views/Lobbies.vue'

Vue.use(Router)

export default new Router({
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
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
        // component: () => import(/* webpackChunkName: "users" */'./views/Users.vue'),
        component: Users,
        children: [
          {
            path: '',
            name: 'usersHome',
            component: () => import(/* webpackChunkName: "usersHome" */'./views/UsersHome.vue')
          },
          {
            path: '/users/new',
            name: 'usersCreate',
            component: () => import(/* webpackChunkName: "usersEdit" */'./views/UsersEdit.vue')
          },
          {
            path: '/users/:userId',
            name: 'usersShow',
            component: () => import(/* webpackChunkName: "usersShow" */'./views/UsersShow.vue')
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
          component: () => import(/* webpackChunkName: "lobbiesHome" */'./views/LobbiesHome.vue')
        },
        {
          path: '/lobbies/new',
          name: 'lobbiesCreate',
          component: () => import(/* webpackChunkName: "lobbiesEdit" */'./views/LobbiesEdit.vue')
        },
        {
          path: '/lobbies/:lobbyId',
          name: 'lobbiesShow',
          component: () => import(/* webpackChunkName: "lobbiesShow" */'./views/LobbiesShow.vue')
        }
      ]
    }
  ]
})
