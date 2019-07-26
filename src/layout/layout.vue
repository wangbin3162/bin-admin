<template>
  <div class="app-wrapper">
    <div class="sidebar-container" :style="{width:isCollapseLeft}">
      <div class="logo" flex="cross:center">
        <img class="icon" src="../assets/images/logo-icon-b.png" alt="logo-small"/>
        <transition name="zoom-in">
          <h1 v-show="sidebar">Bin Admin</h1>
        </transition>
      </div>
      <div class="aside">
        <b-scrollbar style="height:100%;">
          <aside-menu v-if="menuType==='aside'"></aside-menu>
        </b-scrollbar>
      </div>
    </div>
    <div class="main-container" :style="{marginLeft:isCollapseLeft}">
      <!--通用头部-->
      <global-header>
        <header-menu v-if="menuType==='header'"></header-menu>
        <bin-breadcrumb v-else></bin-breadcrumb>
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
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import GlobalHeader from './global-header'
  import HeaderMenu from './nav-menu/head-menu'
  import AsideMenu from './nav-menu/aside-menu'
  import TagsView from './tags-view'
  import BinBreadcrumb from '../components/b-breadcrumb/Breadcrumb'

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
      BinBreadcrumb,
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
