<template>
  <div>
    <ul>
      <li v-for="lobby in lobbies" :key="lobby.id">
        {{ lobby }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'LobbiesList',
  props: {
    lobbies: []
  }
}
</script>
