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
        </slot>
      </div>
      <div class="right-ctrl" flex="cross:center">
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
        <div class="btn" @click="themeModal=true">
          <b-tooltip content="主题" theme="dark">
            <b-icon name="ios-color-palette"></b-icon>
          </b-tooltip>
        </div>
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
      </div>
    </div>
    <b-modal v-model="themeModal" title="主题设置">
      <div class="setting-panel" style="height:200px;">
        <p style="font-size: 16px;margin: 0;line-height: 30px;">主题:</p>
        <div class="theme-tab">
          <b-tooltip content="亮色主题风格" theme="dark">
            <span @click="themChange('light')">
              <img src="../../assets/images/light.svg" alt="">
              <i v-if="activeTheme === 'light'" class="iconfont icon-ios-checkmark"></i>
            </span>
          </b-tooltip>
          <b-tooltip content="暗色主题风格" theme="dark">
            <span @click="themChange('dark')">
              <img src="../../assets/images/dark.svg" alt="">
              <i v-if="activeTheme === 'dark'" class="iconfont icon-ios-checkmark"></i>
            </span>
          </b-tooltip>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'GlobalHeader',
    data () {
      return {
        themeModal: false,
        activeTheme: ''
      }
    },
    watch: {
      theme: {
        handler (val) {
          this.activeTheme = val
        },
        immediate: true
      }
    },
    computed: {
      ...mapGetters(['sidebar', 'theme', 'userInfo'])
    },
    methods: {
      ...mapActions(['logout', 'setThemeMode']),
      toggleSideBar () {
        this.$store.dispatch('toggleSideBar')
      },
      themChange (val) {
        this.setThemeMode(val)
      },
      handleLogout () {
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
</script>
