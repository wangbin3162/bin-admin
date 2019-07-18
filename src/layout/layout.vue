<template>
  <div class="app-wrapper">
    <div class="sidebar-container" :class="sideTheme" :style="{width:isCollapseLeft}">
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
  import settings from '../config/defaultSettings'

  export default {
    name: 'index',
    computed: {
      ...mapGetters(['sidebar']),
      isCollapseLeft () {
        if (this.sidebar) {
          return '240px'
        }
        return '64px'
      },
      sideTheme () {
        return settings.sideTheme
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
      height: 100%;
      z-index: 1001;
      transition: width .3s ease-in-out;
      overflow: hidden;
      .logo {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        overflow: hidden;
        padding-left: 18px;
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
      &.light {
        background-color: #ffffff;
        box-shadow: 2px 0 8px 0 rgba(29, 35, 41, .05)
        .logo {
          background: #ffffff;
          box-shadow: 1px 1px 0 0 #e8e8e8;
          h1 {
            color: #002140;
          }
        }
      }
      &.dark {
        background-color: #001529;
        box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
        .logo {
          background: #002140;
          h1 {
            color: #ffffff;
          }
        }
      }
    }
    .main-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: padding-left .3s ease-in-out;
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
