<template>
  <div>
    <b-tabs v-model="activeTab" :data="tabs"
      @on-change="handleTabChange">
    </b-tabs>
  </div>
</template>

<script>
  export default {
    name: 'SubTabs',
    data () {
      return {
        activeTab: 'modelManage',
        tabs: [
          { key: 'modelManage', title: '模型管理' },
          { key: 'decisionMatrix', title: '判定矩阵' }
        ]
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description b-tabs组件切换回调
       * @param {Object} tab 当前tab
       */
      handleTabChange (tab) {
        this.$emit('tab-change', tab.key)
      }
    }
  }
</script>
