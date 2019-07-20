<template>
  <div class="app-wrapper">
    <div class="sidebar-container" :style="{width:isCollapseLeft}">
      <div class="logo" flex="cross:center">
        <img class="icon" src="../assets/images/logo-icon-b.png" alt="logo-small"/>
        <transition name="zoom-in">
          <h1 v-show="sidebar">Bin Admin</h1>
        </transition>
      </div>
      <aside-menu v-if="menuType==='aside'"></aside-menu>
    </div>
    <div class="main-container" :style="{marginLeft:isCollapseLeft}">
      <!--通用头部-->
      <global-header>
        <header-menu v-if="menuType==='header'"></header-menu>
      </global-header>
      <!--标签栏-->
      <tags-view></tags-view>
      <div class="app-main">
        <transition name="fade-transverse" mode="out-in">
          <keep-alive :include="cachedViews">
            <router-view :key="key"></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
    <!--<a href="#" @click.stop.prevent="logout">退出登录</a>-->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import GlobalHeader from './global-header'
  import HeaderMenu from './header-menu'
  import AsideMenu from './aside-menu'
  import TagsView from './tags-view'

  export default {
    name: 'index',
    computed: {
      ...mapGetters(['sidebar', 'menuType', 'cachedViews']),
      key () {
        return this.$route.fullPath
      },
      isCollapseLeft () {
        if (this.sidebar) {
          return '240px'
        }
        return '64px'
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
  @import "../assets/styles/theme/register.styl"
</style>
