<template>
  <div>
    this is the news page.the transform param is
    <div>{{this.$route.query.q}}</div>
    <div>
    </div>
    <router-link to="/index">返回</router-link>
  </div>
</template>

<script>
  export default {
    name: 'list',
    created () {
      this.fetchData()
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'fetchData'
    },
    methods: {
      fetchData () {
        this.$store.dispatch('setQuery', this.$route.query.q)
      }
    }
  }
</script>
