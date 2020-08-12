<template>
  <div class="market-warn">
    <b-card head-tip shadow="never"
      :body-style="{ padding: 0 }" divider="no">
      <div slot="header" flex="main:justify">
        <span>市场主体预警</span>
        <b-button type="text">更多>></b-button>
      </div>

      <b-table :columns="columns" :data="list" size="small">
      </b-table>
    </b-card>
  </div>
</template>

<script>
  export default {
    name: 'MarketWarn',
    data () {
      return {
        columns: [
          { title: '企业名称', key: 'a', ellipsis: true, tooltip: true, align: 'center' },
          { title: '预警原因', key: 'b', ellipsis: true, tooltip: true, align: 'center' }
        ],
        list: [
          { a: '江苏浮云网络科技有限公司', b: '黑名单' },
          { a: '江苏浮云网络科技有限公司', b: '黑名单' },
          { a: '江苏浮云网络科技有限公司', b: '黑名单' },
          { a: '江苏浮云网络科技有限公司', b: '黑名单' },
          { a: '江苏浮云网络科技有限公司', b: '黑名单' }
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
  .market-warn {

  }
</style>
