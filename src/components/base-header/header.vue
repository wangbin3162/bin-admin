<template>
  <div class="header-wrap">
    <div class="header-inner" flex="main:justify cross:center">
      <img src="../../assets/images/logo2.png" height="60" width="330" alt="logo"/>
      <div class="info" flex="cross:center" v-if="userRoles">
        <img src="../../assets/images/ixon-user.png" height="24" width="24" alt="icon"/>
        <span style="padding:0 20px;">欢迎您，{{ userName }}</span>
        <span class="logout" @click="logout">注销</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseHeader',
    computed: {
      userRoles () {
        return this.$store.state.user.roles
      },
      userName () {
        return this.$store.state.user.info.roleNames
      }
    },
    methods: {
      logout () {
        this.$store.dispatch('logout').then(res => {
          this.$router.push('/login')
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .header-wrap {
    padding: 10px 0;
    background: #fff;
    .header-inner {
      width: 1300px;
      margin: 0 auto;
      .info {
        .logout {
          cursor: pointer;
          background: #1badf8;
          color: #fff;
          border-radius: 15px;
          padding: 6px 15px;
        }
      }
    }
  }
</style>
