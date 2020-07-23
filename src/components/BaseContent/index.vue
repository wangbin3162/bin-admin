<template>
  <div class="base-content">
    <div class="con">
      <b-tabs ref="tabs" v-model="activedTab" :data="tabs"
        type="default" class="mb-20"
        @on-change="handleTabChange">
      </b-tabs>

      <template v-if="tabs.length > 1">
        <tab-con-a v-show="activedTab === '政策法规'"
          :parentColId="pIdMap.get('政策法规')">
        </tab-con-a>

        <tab-con-b v-show="activedTab === '信用动态'"
          :parentColId="pIdMap.get('信用动态')">
        </tab-con-b>
      </template>

      <tab-con-c v-show="activedTab === '通知公告'">
      </tab-con-c>

    </div>
  </div>
</template>

<script>
  import { getTopColumn } from '.././../api/content.api'
  import TabConA from './TabConA'
  import TabConB from './TabConB'
  import TabConC from './TabConC'

  export default {
    name: 'BaseContent',
    components: {
      TabConA,
      TabConB,
      TabConC
    },
    data () {
      return {
         tabs: [
          { key: '通知公告', title: '通知公告' }
        ],
         activedTab: '',
         pIdMap: new Map()
      }
    },
    mounted () {
      this.getTopColumn()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 获取顶层栏目
       */
      async getTopColumn () {
        try {
          const res = await getTopColumn()
          res.forEach(item => {
            item.key = item.colName
            item.title = item.colName
            this.pIdMap.set(item.colName, item.id)
          })
          this.tabs = [...res, ...this.tabs]
          this.activedTab = this.tabs[0].key

          this.$nextTick(() => { // 处理选中
            const cl = this.$refs.tabs
            cl.handleSelectTab(this.tabs[0])
          })
        } catch (error) {
          console.error(error)
        }
      },

      /**
       * @author haodongdong
       * @description b-tabs组件当前tab改变的回调
       * @param {Object} tab 当前的tab对象
       * @param {string} tab.key
       * @param {string} tab.title
       * @param {string} tab.id
       * @param {string} tab.colName
       */
      handleTabChange (tab) {
        this.parentColId = tab.id
      }
    }
  }
</script>

<style lang="stylus">
  .base-content {
    .bin-tabs-wrapper .nav-wrapper .tabs-active-bar {
      height: 1px;
    }
    .bin-tabs-wrapper .nav-wrapper .tab-item {
      font-size: 16px;
      &:hover {
        color: rgba(0,0,0,.65);
      }
    }
    .bin-tabs-wrapper .nav-wrapper .tab-item.active {
      color: rgba(0,0,0,.65);
      font-weight: 600;
    }
  }
</style>

<style lang="stylus" scoped>
  .base-content {
    background: #ffffff;
    margin-bottom: 32px;

    .con {
      margin: 0 auto;
      padding: 20px 0;
      width: 1300px;
    }
  }
</style>
