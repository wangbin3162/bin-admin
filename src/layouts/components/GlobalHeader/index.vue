<template>
  <header class="layout-header" :class="{'fixed-header':fixedHeader}" :style="fixedHeaderStyle">
    <div v-if="hasAside" class="global-header">
      <div class="global-header-trigger" @click="toggleSideBar">
        <b-icon :name="sidebar?'outdent':'indent'"></b-icon>
      </div>
      <div style="flex: 1 1 0;"></div>
      <div class="global-header-right">
        <div class="dropdown-trigger" @click="themeModal=true">
          <b-icon name="ios-color-palette" size="20"></b-icon>
        </div>
        <user-avatar/>
      </div>
    </div>
    <!--顶部导航栏时的内容-->
    <div v-else class="top-nav-header">
      <div class="top-nav-header-main wide">
        <div class="logo">
          <img class="icon" src="../../../assets/images/logo-icon-b.png" alt="logo-small"/>
          <h1>Bin Admin Pro</h1>
        </div>
        <!--顶部导航栏菜单-->
        <div style="flex: 1 1 0;">
          <header-menu/>
        </div>
        <div class="global-header-right">
          <div class="dropdown-trigger" @click="themeModal=true">
            <b-icon name="ios-color-palette" size="20"></b-icon>
          </div>
          <user-avatar/>
        </div>
      </div>
    </div>
    <b-drawer v-model="themeModal" append-to-body :closable="false">
      <div class="setting-panel">
        <h3 class="setting-theme-title">整体风格设置:</h3>
        <div class="mb-20">
          <div class="theme-tab">
            <b-tooltip content="亮色主题风格" theme="dark">
            <span @click="themChange('light')">
              <img src="../../../assets/images/light.svg" alt="">
              <i v-if="theme === 'light'" class="iconfont icon-ios-checkmark"></i>
            </span>
            </b-tooltip>
          </div>
          <div class="theme-tab">
            <b-tooltip content="暗色主题风格" theme="dark">
            <span @click="themChange('dark')">
              <img src="../../../assets/images/dark.svg" alt="">
              <i v-if="theme === 'dark'" class="iconfont icon-ios-checkmark"></i>
            </span>
            </b-tooltip>
          </div>
        </div>
        <b-divider></b-divider>
        <h3 class="setting-theme-title">导航栏模式:</h3>
        <div class="mb-20">
          <div class="theme-tab">
            <b-tooltip content="侧边导航" theme="dark">
            <span @click="menuTypeChange('aside')">
              <img src="../../../assets/images/dark.svg" alt="">
              <i v-if="menuType === 'aside'" class="iconfont icon-ios-checkmark"></i>
            </span>
            </b-tooltip>
          </div>
          <div class="theme-tab">
            <b-tooltip content="顶部导航" theme="dark">
            <span @click="menuTypeChange('header')">
              <img src="../../../assets/images/header.svg" alt="">
              <i v-if="menuType === 'header'" class="iconfont icon-ios-checkmark"></i>
            </span>
            </b-tooltip>
          </div>
        </div>
        <div class="setting-list-item">
          <span>固定Header</span>
          <b-switch size="small" :value="fixedHeader" @on-change="changeFixedHeader"></b-switch>
        </div>
        <div class="setting-list-item">
          <span>固定侧边栏</span>
          <b-switch size="small" :disabled="menuType==='header'" :value="fixedAside"
                    @on-change="changeFixedAside"></b-switch>
        </div>
      </div>
    </b-drawer>
  </header>
</template>

<script>
  import { mapGetters } from 'vuex'
  import HeaderMenu from './HeaderMenu'
  import UserAvatar from './UserAvatar'

  export default {
    name: 'GlobalHeader',
    components: { HeaderMenu, UserAvatar },
    data() {
      return {
        themeModal: false
      }
    },
    computed: {
      ...mapGetters(['theme', 'sidebar', 'menuType', 'fixedHeader', 'fixedAside']),
      hasAside() {
        return this.menuType === 'aside'
      },
      fixedHeaderStyle() {
        return {
          padding: 0,
          width: this.hasAside ? (this.fixedHeader ? `calc(100% - ${this.sidebar ? 240 : 64}px)` : '100%') : '100%',
          zIndex: 9,
          right: this.fixedHeader ? 0 : null
        }
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      themChange(val) {
        this.$store.dispatch('setThemeMode', val)
      },
      menuTypeChange(type) {
        this.$store.dispatch('setMenuType', type)
        // 重定向当前页面
        this.$router.replace('/refresh')
      },
      changeFixedHeader(val) {
        this.$store.dispatch('toggleFixedHeader', val)
        console.log(val)
      },
      changeFixedAside(val) {
        this.$store.dispatch('toggleFixedAside', val)
      }
    }
  }
</script>
