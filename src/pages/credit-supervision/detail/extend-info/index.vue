<template>
  <div class="extend-info">
    <div class="nav">
      <b-tabs v-model="activeTab" :data="tabs"
        @on-change="handleTabsChange">
      </b-tabs>
    </div>

    <div class="main-con">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'CreditSupervisionDetailExtendInfo',
    data () {
      return {
        activeTab: 'recentDynamic',
        tabs: [
        { key: 'recentDynamic', title: '近期动态' },
        { key: 'redBlackListInfo', title: '红黑名单信息' },
        { key: 'focusScopeSupervision', title: '重点领域监管' }
      ]
      }
    },
    computed: {
      ...mapState({
        recentDynamic: state => state.creSupDetail.recentDynamic,
        redBlackListInfo: state => state.creSupDetail.redBlackListInfo,
        focusScopeSupervision: state => state.creSupDetail.focusScopeSupervision
      })
    },
    watch: {
      recentDynamic: {
        handler (newVal) {
          this.tabs[0].title = `近期动态(${newVal.length})`
        },
        immediate: true
      },
       redBlackListInfo: {
        handler (newVal) {
          this.tabs[1].title = `红黑名单信息(${newVal.length})`
        },
        immediate: true
      },
       focusScopeSupervision: {
        handler (newVal) {
          this.tabs[2].title = `重点领域监管(${newVal.length})`
        },
        immediate: true
      }
    },
    created () {
      this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 一些初始化处理
       */
      init () {
        const route = this.$route
        this.activeTab = route.name
      },

      /**
       * @author haodongdong
       * @description b-tabs组件当前tab改变回调
       * @param {Object} tab 当前tab对象
       */
      handleTabsChange (tab) {
        this.activeTab = tab.key
        this.$router.push({
          path: tab.key,
          query: this.$route.query
        })
      }
    }
  }
</script>

<style lang="stylus">
  .extend-info {
    .nav {
      .bin-tabs-wrapper.default:after {
        height: 1px;
        width: 1300px;
        margin-left: -42px;
      }
      .bin-tabs-wrapper .nav-wrapper .tabs-active-bar {
        height: 2px;
      }
      .bin-tabs-wrapper .nav-wrapper .tab-item {
        position: relative;
        top: -11px;
        font-size: 15px;
        &:hover {
          color: rgba(0,0,0,.65);
        }
      }
      .bin-tabs-wrapper .nav-wrap.is-scrollable .nav-prev {
        top: -12px;
      }
      .bin-tabs-wrapper .nav-wrap.is-scrollable .nav-next {
        top: -12px;
      }
      .bin-tabs-wrapper .nav-wrapper .tab-item.active {
        color: rgba(0,0,0,.65);
        font-weight: 600;
      }
    }
  }
</style>

<style lang="stylus" scoped>
  .extend-info {
    width: 100%;
    background: #ffffff;
    border-radius: 10px;
    padding: 0 42px;

    .nav {
      padding: 20px 0;
    }

    .main-con {
      padding-bottom: 20px;
    }
  }
</style>
