<template>
  <div>
    <b-tabs v-model="activeTab" :data="tabs" type="card"
      @on-change="handleTabChange">
    </b-tabs>
  </div>
</template>

<script>
  export default {
    name: 'MainTabs',
    data () {
      return {
        activeTab: 'editWeight',
        tabs: [
          { key: 'globalWeight', title: '全局权重' },
          { key: 'editWeight', title: '编辑权重' }
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
