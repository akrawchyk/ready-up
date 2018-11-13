<template>
  <div id="lobbiesShow">
    <div>{{ currentLobby }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LobbiesShow',
  // TODO build LobbyMembersList
  computed: {
    ...mapGetters(['currentLobby'])
  }
}
</script>
