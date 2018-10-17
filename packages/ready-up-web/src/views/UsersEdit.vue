<template>
  <div class="usersEdit">
    <form @submit.prevent="onSave()">
      <fieldset
        class="form-group"
        :disabled="inProgress">
        <label for="displayName">Display Name</label>
        <input
          v-model="creatingUser.displayName"
          class="form-control"
          id="displayName"
          type="text">
      </fieldset>
      <button
        class="btn btn-primary"
        type="submit"
        :disabled="inProgress">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'UsersEdit',
  data () {
    return {
      creatingUser: {},
      inProgress: false,
      errors: {}
    }
  },
  computed: {
    userParams () {
      return {
        displayName: this.creatingUser.displayName
      }
    }
  },

  methods: {
    ...mapActions([
      'createUser'
    ]),

    async onSave () {
      // TODO
      // ;(this.multiLot.id
      //   ? this.editMultiLot(id, article)
      //   : this.createMultiLot(article))
      this.errors = {}
      this.inProgress = true

      try {
        await this.createUser(this.userParams)
        this.inProgress = false
        this.creatingUser = {}
        this.errors = {}
        this.$router.push({
          name: 'usersHome'
        })
      } catch(error) {
        this.inProgress = false
        this.errors = { lots: [error.message] }
      }
    }
  }
}
</script>
