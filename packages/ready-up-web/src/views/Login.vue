<template>
  <div id="login">
    <h1>Login</h1>
    <ErrorList :errors="errors" />
    <form @submit.prevent="onSubmit()">
      <fieldset class="form-group" :disabled="inProgress">
        <div>
          <p>
            <label for="displayName">Display Name</label>
          </p>
          <input
            v-model="user.displayName"
            class="form-control"
            id="displayName"
            type="text"
          />
        </div>
        <div>
          <p>
            <label for="password">Password</label>
          </p>
          <input
            v-model="user.password"
            class="form-control"
            id="password"
            type="password"
          />
        </div>
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
import { mapGetters, mapActions } from 'vuex'

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
    ...mapGetters(['currentSession']),
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

      if (this.currentSession) {
        // FIXME if redirect, go to redirect
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
