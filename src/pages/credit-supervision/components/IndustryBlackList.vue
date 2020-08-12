<template>
  <div class="industry-black-list">
    <b-card head-tip shadow="never"
      :body-style="{ padding: 0 }" divider="no">
      <div slot="header" flex="main:justify">
        <span>行业黑名单排行</span>
        <b-button type="text">更多>></b-button>
      </div>

      <b-table :columns="columns" :data="list" size="small">
      </b-table>
    </b-card>
  </div>
</template>

<script>
  export default {
    name: 'IndustryBlackList',
    data () {
      return {
        columns: [
          { title: '行业', key: 'a', ellipsis: true, tooltip: true, align: 'center' },
          { title: '黑名单企业数量', ellipsis: true, tooltip: true, key: 'b', align: 'center' },
          { title: '占比', key: 'b', ellipsis: true, tooltip: true, align: 'center' }
        ],
        list: [
          { a: '江苏浮云网络科技有限公司', b: '128' },
          { a: '江苏浮云网络科技有限公司', b: '400' },
          { a: '江苏浮云网络科技有限公司', b: '300' },
          { a: '江苏浮云网络科技有限公司', b: '700' },
          { a: '江苏浮云网络科技有限公司', b: '500' }
        ]
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
  .industry-black-list {

  }
</style>
