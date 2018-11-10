<template>
  <div v-if="errors.length > 0">
    <div v-for="error in errors">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'ErrorList',
  props: {
    errors: Array
  }
}
</script>
