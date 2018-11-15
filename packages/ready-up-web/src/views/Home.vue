<template>
  <div class="home">
    <h1>Welcome to Ready Up</h1>
    {{ currentSession }}
    <p v-if="currentSession">
      Hello, {{ currentSession.user.displayName }}!
      <router-link to="lobbies/new"> Create a new lobby </router-link>
    </p>
    <p v-else>
      <router-link to="users/new"> Create a new user </router-link>
      or
      <router-link to="login"> login to an existing one </router-link>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['currentSession'])
  }
}
</script>
