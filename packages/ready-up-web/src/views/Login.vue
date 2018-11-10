<template>
  <div class="login">
    <h1>Login</h1>
    <ErrorList :errors="errors" />
    <form @submit.prevent="onSubmit()">
      <fieldset class="form-group" :disabled="inProgress">
        <label for="displayName">Display Name</label>
        <input
          v-model="user.displayName"
          class="form-control"
          id="displayName"
          type="text"
        />
        <label for="password">Password</label>
        <input
          v-model="user.password"
          class="form-control"
          id="password"
          type="password"
        />
      </fieldset>
      <button class="btn btn-primary" type="submit" :disabled="inProgress">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import ErrorList from '@/components/ErrorList'
import { formUtilsMixin } from '@/mixins'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Home',
  components: {
    ErrorList
  },
  mixins: [formUtilsMixin],
  data() {
    return {
      user: {},
      inProgress: false,
      errors: []
    }
  },
  computed: {
    ...mapState({
      session: (state) => state.currentSession
    }),
    sessionParams() {
      return {
        userDisplayName: this.user.displayName,
        userPassword: this.user.password
      }
    }
  },
  methods: {
    ...mapActions(['createSession', 'getSession']),

    async onSubmit() {
      this.setProgress()

      try {
        await this.createSession(this.sessionParams)

        this.reset()
        this.$router.push({
          name: 'lobbiesCreate'
        })
      } catch (error) {
        this.setError(error)
      }
    }
  },
  created: async function() {
    this.setProgress()

    try {
      await this.getSession()

      if (this.session) {
        this.$router.push({
          name: 'lobbiesCreate'
        })
      }
    } catch (err) {
      this.reset()
    }
  }
}
</script>
