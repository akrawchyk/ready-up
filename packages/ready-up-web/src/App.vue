<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/users">Users</router-link> |
      <router-link to="/lobbies">Lobbies</router-link>
    </div>
    <router-view />

    <FirebaseMessaging />
  </div>
</template>

<script>
import FirebaseMessaging from '@/components/FirebaseMessaging'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    FirebaseMessaging
  },
  methods: {
    ...mapActions(['getSession'])
  },
  async beforeMount () {
    await this.getSession()
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  /* -webkit-font-smoothing: antialiased; */
  /* -moz-osx-font-smoothing: grayscale; */
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
