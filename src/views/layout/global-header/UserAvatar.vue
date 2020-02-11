<template>
  <div class="avatar">
    <b-dropdown>
      <span class="user-link">
        <i class="iconfont icon-ios-contact"></i>
        <span>你好,{{userInfo.name}}</span>
      </span>
      <b-dropdown-menu slot="list">
        <b-dropdown-item @click.native="handleLogout">
          <b-icon name="ios-log-out" size="16"></b-icon>
          <span style="vertical-align: middle;">注销登录</span>
        </b-dropdown-item>
      </b-dropdown-menu>
    </b-dropdown>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'UserAvatar',
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      handleLogout () {
        this.$confirm({
          title: '注销',
          content: '确认退出登录吗？',
          onOk: () => {
            this.$store.dispatch('logout').then(() => {
              this.$router.push({ name: 'Login' })
            }).catch(err => {
              this.$message({ type: 'danger', content: err.message })
            })
          }
        })
      }
    }
  }
</script>
