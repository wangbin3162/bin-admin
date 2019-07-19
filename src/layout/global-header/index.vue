<template>
  <div class="global-header">
    <!--toggle-btn-->
    <div class="toggle-btn">
      <b-icon name="ios-menu" :class="{'open':sidebar}"
              @click.native="toggleSideBar"></b-icon>
    </div>
    <div class="header-box">
      <div class="left-box">
        <slot>
          header-menu
        </slot>
      </div>
      <div class="right-ctrl" flex>
        <!--外部链接-->
        <a href="#" target="_blank" class="btn">
        <span class="action">
          <b-icon name="ios-help-circle"></b-icon>
        </span>
        </a>
        <div class="btn">
          <b-icon name="ios-notifications-outline"></b-icon>
        </div>
        <div class="btn">
          <b-icon name="ios-bug"></b-icon>
        </div>
        <div class="avatar">
          <el-dropdown size="medium" @command="handleCommand">
          <span class="el-dropdown-link">
             <img src="../../assets/images/logo-icon-a.png" alt="avatar"/>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{type:'user'}" icon="el-icon-s-custom">用户中心</el-dropdown-item>
              <el-dropdown-item :command="{type:'logout'}" icon="el-icon-switch-button">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'GlobalHeader',
    computed: {
      ...mapGetters(['sidebar']),
      ...mapActions(['logout'])
    },
    methods: {
      toggleSideBar () {
        this.$store.dispatch('toggleSideBar')
      },
      handleCommand (command) {
        if (command.type === 'user') {
          this.$message('用户中心，暂时留空')
        }
        // 登出
        if (command.type === 'logout') {
          this.$confirm({
            title: '注销',
            content: '确认退出登录吗？',
            onOk: () => {
              this.$store.dispatch('logout').then(() => {
                this.$router.push({ name: 'login' })
              }).catch(err => {
                this.$message({ type: 'danger', content: err.message })
              })
            }
          })
        }
      }
    }
  }
</script>
