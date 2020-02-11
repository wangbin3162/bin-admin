<template>
  <div class="app-wrapper">
    <div class="sidebar-container" :style="{width:isCollapseLeft}">
      <div class="logo" flex="cross:center">
        <img class="icon" src="../../assets/images/logo-icon-b.png" alt="logo-small"/>
        <transition name="zoom-in">
          <h1 v-show="sidebar">Bin Admin</h1>
        </transition>
      </div>
      <div class="aside">
        <aside-menu></aside-menu>
      </div>
    </div>
    <div class="main-container" :style="{paddingLeft:isCollapseLeft}">
      <!--通用头部-->
      <global-header>
        <header-menu v-if="menuType==='header'"></header-menu>
        <v-breadcrumb v-else></v-breadcrumb>
      </global-header>
      <!--标签栏-->
      <tags-view></tags-view>
      <div class="app-main" ref="contentWrapper">
        <transition name="fade-transverse" @enter="calcTableWidth">
          <keep-alive :include="cachedViews">
            <router-view :key="key"></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import GlobalHeader from './global-header/index'
  import HeaderMenu from './nav-menu/HeaderMenu'
  import AsideMenu from './nav-menu/AsideMenu'
  import TagsView from './tags-view/index'

  export default {
    name: 'Layout',
    computed: {
      ...mapGetters(['sidebar', 'menuType', 'cachedViews']),
      key() {
        return this.$route.fullPath
      },
      isCollapseLeft() {
        if (this.sidebar) {
          return '240px'
        }
        return '64px'
      }
    },
    watch: {
      $route: {
        handler: function (val) {
          if (this.menuType === 'header') {
            this.$store.dispatch('setAsideMenu', val.path)
          }
        },
        immediate: true
      }
    },
    mounted() {
      this.wrap = this.$refs.contentWrapper
      if (this.wrap) {
        this.$nextTick(() => {
          this.calcTableWidth()
        })
        window.addEventListener('resize', this.calcTableWidth)
        this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
        this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
      }
    },
    methods: {
      calcTableWidth() {
        let width = this.wrap ? this.wrap.clientWidth : 800
        // 全局通信，这里不缓存至vuex中，用于传递当前app-main宽度, mixin中监听此方法用于统一窗口宽度
        this.$EventBus.$emit('/layout/resize', width)
      },
      sidebarResizeHandler(e) {
        if (e.propertyName === 'width') {
          this.calcTableWidth()
        }
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.calcTableWidth)
      if (this.sidebarElm) {
        this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)
      }
    },
    components: {
      GlobalHeader,
      HeaderMenu,
      TagsView,
      AsideMenu
    }
  }
</script>

<style lang="stylus">
  @import "../../assets/styles/theme/register.styl"
</style>
