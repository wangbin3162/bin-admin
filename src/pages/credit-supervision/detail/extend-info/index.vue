<template>
  <transition name="fade-scale-move">
    <div v-if="visible" class="extend-info">
      <div class="nav">
        <b-tabs v-model="activeTab" :data="tabs"
          @on-change="handleTabsChange">
        </b-tabs>
      </div>

      <div class="main-con">
        <router-view></router-view>
      </div>
    </div>
  </transition>
</template>

<script>
  import { getPersonDynamic, getRedBlackOrFocusScope } from '@/api/credit-supervision/detail.api'

  export default {
    name: 'CreditSupervisionDetailExtendInfo',
    data () {
      return {
        visible: false,
        activeTab: 'recentDynamic',
        tabs: [
        { key: 'recentDynamic', title: '近期动态' },
        { key: 'redBlackListInfo', title: '红黑名单信息' },
        { key: 'focusScopeSupervision', title: '重点领域监管' }
      ]
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
        this.getTabsTotal()
      },

      /**
       * @author haodongdong
       * @description 用于获取近期动态、红黑名单信息、重点领域监管的总计数据，显示在tabs的标题中。不要问为什么要这样获取┑(￣Д ￣)┍。
       */
      async getTabsTotal () {
        const { id, type } = this.$route.query
        const param = {
          size: 10,
          page: 1
        }
        try {
          const [res1, res2, res3] = await Promise.all([
            getPersonDynamic({
              ...param,
              id,
              type,
              month: 1
            }),
            getRedBlackOrFocusScope({
              ...param,
              personId: id
            }),
            getRedBlackOrFocusScope({
              ...param,
              personId: id,
              jgType: 'IA'
            })
          ])
          this.tabs[0].title = `近期动态(${res1.total})`
          this.tabs[1].title = `红黑名单信息(${res2.total})`
          this.tabs[2].title = `重点领域监管(${res3.total})`

          this.visible = true
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '加载失败',
            desc: error
          })
        }
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
