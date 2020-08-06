<template>
  <div class="header-wrap" :class="{normal}">
    <div class="header-inner" flex="main:justify cross:center">
      <img src="../../../assets/images/excavate/logo.png" alt="logo" class="logo" @click="clickLogo"/>
      <div class="info" flex="cross:center" v-if="userRoles">
        <b-dropdown>
          <div class="user" flex="main:center cross:center">
            <b-icon name="ios-contact" size="20" color="#fafafa"/>
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
  name: 'ExcHeader',
  props: {
    normal: Boolean
  },
  computed: {
    userRoles() {
      return this.$store.state.user.roles
    },
    userName() {
      return this.$store.state.user.info.realName
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout').then(res => {
        this.$router.push('/login')
      })
    },
    clickLogo() {
      this.$router.push('/excavate')
    }
  }
}
</script>

<style scoped lang="stylus">
.header-wrap {
  background: #205ad8;
  box-shadow: 0 0 8px rgba(100, 100, 100, 0.5);
  height: 80px;
  .header-inner {
    position: relative;
    width: 1300px;
    height: 100%;
    margin: 0 auto;
    .user {
      width: auto;
      padding: 0 10px;
      color: #fff;
    }
  }
}
</style>
