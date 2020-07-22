<template>
  <div class="base-content">
    <div class="con">
      <b-tabs v-model="activedTab" :data="tabs"
        type="card" class="mb-20"
        @on-change="handleTabChange">
      </b-tabs>

      <tab-con-a v-if="activedTab === '政策法规'"
        :parentColId="parentColId">
      </tab-con-a>

      <tab-con-b v-if="activedTab === '信用动态'"
        :parentColId="parentColId">
      </tab-con-b>

    </div>
  </div>
</template>

<script>
  import { getTopColumn } from '.././../api/content.api'
  import TabConA from './TabConA'
  import TabConB from './TabConB'

  export default {
    name: 'BaseContent',
    components: {
      TabConA,
      TabConB
    },
    data () {
      return {
         tabs: [
          { key: '通知公告', title: '通知公告' }
        ],
         activedTab: '',
         parentColId: null
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
            this.tabs.push(item)
          })
          this.parentColId = this.tabs[2].id
          this.activedTab = this.tabs[2].key
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
        console.log(tab)
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
