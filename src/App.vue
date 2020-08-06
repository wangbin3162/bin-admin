<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'app',
  watch: {
    '$route.path'() {
      this.$nextTick(() => {
        if (this.$route.meta.title) {
          this.$util.title(this.$route.meta.title)
        }
      })
    }
  }
}
</script>
<style lang="stylus">
#app {
  height: 100vh;
}
</style>
