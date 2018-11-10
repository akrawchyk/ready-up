<template>
  <div id="usersShow">
    <ErrorList :errors="errors" />
    <div>{{ user }}</div>
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
  data() {
    return {
      inProgress: false,
      errors: []
    }
  },
  mixins: [formUtilsMixin],
  computed: {
    ...mapState({
      user: (state) => state.viewingUser
    }),
    userQuery() {
      return {
        id: this.$route.params.userId
      }
    }
  },
  methods: {
    ...mapActions(['getUser'])
  },

  mounted: async function() {
    try {
      await this.getUser(this.userQuery)
    } catch (error) {
      this.setError(error)
    }
  }
}
</script>
