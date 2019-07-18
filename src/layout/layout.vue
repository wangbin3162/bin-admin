<template>
  <div class="app-wrapper">
    <div class="sidebar-container" :style="{width:isCollapseLeft}">
      <div class="logo" flex="cross:center">
        <img class="icon" src="../assets/images/logo-icon-b.png" alt="logo-small"/>
        <transition name="zoom-in">
          <h1 v-show="sidebar">Bin Admin</h1>
        </transition>
      </div>
      <!--<menu-bar :routes="routes" :isCollapse="isCollapse"></menu-bar>-->
    </div>
    <div class="main-container" :style="{marginLeft:isCollapseLeft}">
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
  import GlobalHeader from './header/GlobalHeader'

  export default {
    name: 'index',
    computed: {
      ...mapGetters(['sidebar']),
      routes () {
        return this.$router.options.routes
      },
      isCollapseLeft () {
        if (this.sidebar) {
          return '256px'
        }
        return '80px'
      }
    },
    components: {
      GlobalHeader
    }
  }
</script>

<style lang="stylus">
  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 0;
    .sidebar-container {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 256px;
      height: 100%;
      z-index: 1001;
      transition: width .3s ease-in-out;
      background-color: #001529;
      box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
      overflow: hidden;
      .logo {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 64px;
        overflow: hidden;
        background: #002140;
        padding-left: 24px;
        .icon {
          height: 40px;
        }
        h1 {
          color: #fff;
          font-size: 20px;
          margin: 0 0 0 12px;
          white-space: nowrap;
        }
      }
    }
    .main-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: margin-left .3s ease-in-out;
      background-color: #ffffff;
      color: #303133;
      .app-main {
        flex: 1;
        background-color: #f0f2f5;
        overflow: auto;
      }
    }
  }
</style>
