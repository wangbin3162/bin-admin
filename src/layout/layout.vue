<template>
  <div class="app-wrapper">
    <div class="sidebar-container" :style="{width:isCollapseLeft}">
      <div class="logo" flex="cross:center">
        <img class="icon" src="../assets/images/logo-icon-b.png" alt="logo-small"/>
        <transition name="zoom-in">
          <h1 v-show="sidebar">Bin Admin</h1>
        </transition>
      </div>
      <!--<aside-menu></aside-menu>-->
    </div>
    <div class="main-container" :style="{paddingLeft:isCollapseLeft}">
      <!--通用头部-->
      <global-header>
        <header-menu></header-menu>
      </global-header>
      <!--&lt;!&ndash;tags&ndash;&gt;-->
      <!--<tags-view></tags-view>-->
      <!--&lt;!&ndash;main&ndash;&gt;-->
      <div class="app-main">
        <transition name="fade-transverse" mode="out-in">
          <keep-alive>
            <router-view></router-view>
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

  export default {
    name: 'index',
    computed: {
      ...mapGetters(['sidebar']),
      isCollapseLeft () {
        if (this.sidebar) {
          return '240px'
        }
        return '64px'
      }
    },
    components: {
      GlobalHeader,
      HeaderMenu
    }
  }
</script>

<style lang="stylus">
  @import "../assets/styles/theme/register.styl"
</style>
