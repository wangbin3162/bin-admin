<template>
  <base-layout>
    <div class="main-wrap">
      <top-affix>
        <base-header>
          <top-search @on-search="backToIndex" @on-back="backToIndex"></top-search>
        </base-header>
      </top-affix>
      <div v-for="i in 50" :key="i">这是内容{{i}}</div>
    </div>
  </base-layout>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'detail',
    computed: {
      ...mapGetters(['currentDetailId'])
    },
    methods: {
      backToIndex () {
        this.$router.push('/index')
      }
    }
  }
</script>

<style scoped lang="stylus">
  .main-wrap {
    background: #f0f2f3;
  }
</style>
