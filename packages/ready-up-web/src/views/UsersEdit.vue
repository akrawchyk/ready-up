<template>
  <div id="usersEdit">
    <ErrorList :errors="errors" />
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
import ErrorList from '@/components/ErrorList'
import { formUtilsMixin } from '@/mixins'
import { mapActions } from 'vuex'

export default {
  name: 'UsersEdit',
  components: {
    ErrorList
  },
  data () {
    return {
      creatingUser: {},
      inProgress: false,
      errors: []
    }
  },
  mixins: [formUtilsMixin],
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

      this.setProgress()

      try {
        await this.createUser(this.userParams)
        this.reset()
        this.creatingUser = {}
        this.$router.push({
          name: 'usersHome'
        })
      } catch (error) {
        this.setError(error)
      }
    }
  }
}
</script>
