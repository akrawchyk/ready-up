<template>
  <div id="lobbiesEdit">
    <ErrorList :errors="errors" />
    <form @submit.prevent="onSubmit()">
      <!-- <fieldset -->
      <!--   class="form&#45;group" -->
      <!--   :disabled="inProgress"> -->
      <!--   <label for="displayName">Display Name</label> -->
      <!--   <input -->
      <!--     v&#45;model="creatingUser.displayName" -->
      <!--     class="form&#45;control" -->
      <!--     id="displayName" -->
      <!--     type="text"> -->
      <!-- </fieldset> -->
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
import { mapState, mapActions } from 'vuex'

export default {
  name: 'LobbiesEdit',
  components: {
    ErrorList
  },
  mixins: [formUtilsMixin],
  data () {
    return {
      inProgress: false,
      errors: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.currentUser,
      lobby: state => state.currentLobby
    }),
    lobbyParams () {
      return {
        createdByUserId: this.user.id
      }
    }
  },
  methods: {
    ...mapActions([
      'createLobby'
    ]),

    async onSubmit () {
      // TODO
      // ;(this.multiLot.id
      //   ? this.editMultiLot(id, article)
      //   : this.createMultiLot(article))

      this.setProgress()

      try {
        await this.createLobby(this.lobbyParams)
        this.reset()
        this.$router.push({
          name: 'lobbiesShow',
          params: {
            lobbyId: this.lobby.id
          }
        })
      } catch (error) {
        this.setError(error)
      }
    }
  }
}
</script>
