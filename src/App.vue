<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  export default {
    name: 'app'
  }
</script>
<style lang="stylus">
  @import './assets/styles/index.styl'
  #app {
    height: 100%;
  }
</style>
