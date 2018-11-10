<template>
  <div id="lobbiesShow">
    <div>{{ lobby }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LobbiesShow',
  // TODO build LobbyMembersList
  computed: {
    ...mapState({
      lobby: (state) => state.currentLobby
    })
  }
}
</script>
