<template>
  <div class="header-wrap">
    <div class="header-inner" flex="main:justify cross:center">
      <img src="../../../assets/images/urp/logo_lhjc.png" alt="logo" class="logo"/>
      <div class="info" flex="cross:center" v-if="userRoles">
        <div class="links">
          <div class="inner">
            <span class="item"><a href="" @click.stop.prevent="home">首页</a></span>
          </div>
        </div>
        <b-dropdown>
          <div class="user" flex="main:center cross:center">
            <img src="../../../assets/images/icon-user.png" height="24" width="24" alt="icon"/>
            <span class="pl-5">
                {{ userName }}
                <b-icon name="md-arrow-dropdown" size="20"></b-icon>
              </span>
          </div>
          <b-dropdown-menu slot="list">
            <b-dropdown-item @click.native="logout">注销</b-dropdown-item>
          </b-dropdown-menu>
        </b-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'UrpHeader',
    computed: {
      userRoles() {
        return this.$store.state.user.roles
      },
      userName() {
        return this.$store.state.user.info.realName
      }
    },
    methods: {
      home() {
        this.$emit('on-home')
        this.$router.push('/urp/index')
      },
      logout() {
        this.$store.dispatch('logout').then(res => {
          this.$router.push('/login')
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .header-wrap {
    background: rgba(13, 133, 255, 0.1);
    box-shadow: 0 0 8px rgba(143, 143, 143, 0.51);
    height: 80px;
    .header-inner {
      position: relative;
      width: 1300px;
      height: 100%;
      margin: 0 auto;
      .logo {
        height: 100%;
      }
      .links {
        .inner {
          text-align: right;
          .item {
            display inline-block;
            width: 110px;
            text-align: center;
            a {
              color: #fff;
            }
          }
        }
      }
      .user {
        width: auto;
        padding: 0 10px;
        color: #fff;
      }
    }
  }
</style>
