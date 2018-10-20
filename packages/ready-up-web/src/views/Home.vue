<template>
  <div class="home">
    <h1>Welcome to Ready Up</h1>
    {{ session }}
    <p v-if="session">
      Hello, {{ session.userDisplayName }}!
      <router-link to="lobbies/new">
        Create a new lobby
      </router-link>
    </p>
    <p v-else>
      <router-link to="users/new">
        Create a new user
      </router-link>
      or
      <router-link to="login">
        login to an existing one
      </router-link>
    </p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState({
      session: state => state.currentSession
    })
  },
}
</script>
