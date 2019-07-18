<template>
  <div>
    <h2>首页</h2>
    <p>{{userInfo}}</p>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'index',
    computed: {
      ...mapGetters(['userInfo'])
    }
  }
</script>

<style scoped>

</style>
