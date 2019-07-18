<template>
  <div class="app-wrapper" :class="'theme-'+themeName">
    <div class="sidebar-container" :style="{width:isCollapseLeft}">
      <div class="logo" flex="cross:center">
        <img class="icon" src="../assets/images/logo-icon-b.png" alt="logo-small"/>
        <transition name="zoom-in">
          <h1 v-show="sidebar">Bin Admin</h1>
        </transition>
      </div>
      <!--<menu-bar :theme="sideTheme"></menu-bar>-->
    </div>
    <div class="main-container" :style="{paddingLeft:isCollapseLeft}">
      <!--通用头部-->
      <global-header></global-header>
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
  import GlobalHeader from './GlobalHeader/GlobalHeader'

  export default {
    name: 'index',
    computed: {
      ...mapGetters(['sidebar', 'themeName']),
      isCollapseLeft () {
        if (this.sidebar) {
          return '240px'
        }
        return '64px'
      }
    },
    components: {
      GlobalHeader
    }
  }
</script>

<style lang="stylus">
  @import "../assets/styles/theme/register.styl"
</style>
