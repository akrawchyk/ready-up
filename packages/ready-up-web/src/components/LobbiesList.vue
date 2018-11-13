<template>
  <div>
    <ul>
      <li v-for="lobby in lobbies" :key="lobby.id">
        <div>Lobby {{ lobby.id }}</div>
        <div>Lobby Members:</div>
        <ul>
          <li v-for="lobbyMember in lobby.lobbyMembers" :key="lobbyMember.id">
            {{ lobbyMember.user.displayName }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'LobbiesList',
  props: {
    lobbies: Array
  }
}
</script>
