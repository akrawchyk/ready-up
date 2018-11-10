<template>
  <div id="usersEdit">
    <ErrorList :errors="errors" />
    <form @submit.prevent="onSubmit()">
      <fieldset class="form-group" :disabled="inProgress">
        <label for="displayName">Display Name</label>
        <input
          v-model="creatingUser.displayName"
          class="form-control"
          id="displayName"
          type="text"
        />
        <label for="password">Password</label>
        <input
          v-model="creatingUser.password"
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
import { mapActions } from 'vuex'

export default {
  name: 'UsersEdit',
  components: {
    ErrorList
  },
  mixins: [formUtilsMixin],
  data() {
    return {
      creatingUser: {},
      inProgress: false,
      errors: []
    }
  },
  computed: {
    userParams() {
      return {
        displayName: this.creatingUser.displayName,
        password: this.creatingUser.password
      }
    }
  },
  methods: {
    ...mapActions(['createUser']),

    async onSubmit() {
      // TODO
      // ;(this.multiLot.id
      //   ? this.editMultiLot(id, article)
      //   : this.createMultiLot(article))

      this.setProgress()

      try {
        await this.createUser(this.userParams)
        this.reset()
        this.creatingUser = {}
        this.$router.push({
          name: 'login'
        })
      } catch (error) {
        this.setError(error)
      }
    }
  }
}
</script>
