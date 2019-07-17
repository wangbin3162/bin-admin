<template>
  <div>layout-index
    <br>
    <a href="#" @click.stop.prevent="logout">退出登录</a>
  </div>
</template>

<script>
  export default {
    name: 'index',
    methods: {
      logout () {
        this.$confirm({
          title: '注销',
          content: '确认退出登录吗？',
          onOk: () => {
            console.log('退出登录')
            this.$store.dispatch('logout').then(() => {
              this.$router.push({ name: 'login' })
            }).catch(err => {
              this.$message({ type: 'danger', content: err.message })
            })
          }
        })
        // this.$store.dispatch('logout')
        // console.log('退出登录')
      }
    }
  }
</script>

<style scoped>

</style>
