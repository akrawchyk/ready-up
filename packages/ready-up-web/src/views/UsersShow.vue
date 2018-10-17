<template>
  <div id="usersShow">
    <ErrorList :errors="errors" />
    <div>
      {{ user }}
    </div>
  </div>
</template>

<script>
import ErrorList from '@/components/ErrorList'
import { formUtilsMixin } from '@/mixins'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'UsersShow',
  components: {
    ErrorList
  },
  data () {
    return {
      inProgress: false,
      errors: []
    }
  },
  mixins: [formUtilsMixin],
  computed: {
    ...mapState({
      user: state => state.viewingUser
    }),
    userQuery () {
      return {
        id: this.$route.params.userId
      }
    }
  },
  methods: {
    ...mapActions([
      'getUser'
    ]),

    async onGet () {
      try {
        await this.getUser(this.userQuery)
      } catch (error) {
        console.log(error)
        this.setError(error)
      }
    }
  },

  mounted: function () {
    this.onGet()
  }
}
</script>
