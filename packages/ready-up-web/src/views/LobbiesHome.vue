<template>
  <div id="lobbiesHome">
    <router-link to="lobbies/new">
      <a>Create New Lobby</a>
    </router-link>
    <LobbiesList :lobbies="lobbies"/>
  </div>
</template>

<script>
import LobbiesList from '@/components/LobbiesList'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LobbiesHome',
  components: {
    LobbiesList
  },
  computed: {
    ...mapGetters(['lobbies'])
  },
  methods: {
    ...mapActions(['queryLobbies'])
  },
  async beforeMount() {
    await this.queryLobbies()
  }
}
</script>
