<template>
  <div class="tip-market-warn">
    <b-card head-tip shadow="never"
      :body-style="{ padding: 0 }" divider="no">
      <div slot="header" flex="main:justify">
        <span>市场主体预警</span>
        <b-button type="text"
          @click="$router.push('/creditSupervision/marketPlayersWarn')">
          更多>>
        </b-button>
      </div>

      <b-table :columns="columns" :data="list" size="small">
      </b-table>
    </b-card>
  </div>
</template>

<script>
  import { getMarketWarnList } from '@/api/credit-supervision/market-players-warn.api'

  export default {
    name: 'TipMarketWarn',
    data () {
      return {
        listLoading: false,
        query: {
          size: 10,
          page: 1
        },
        list: [],
        columns: [
          { title: '企业名称', key: 'compName', ellipsis: true, tooltip: true, align: 'left' },
          { title: '预警原因', key: 'resourceName', ellipsis: true, tooltip: true, align: 'center' }
        ]
      }
    },
    created () {
      this.getList()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 获取市场主体预警列表
       */
      async getList () {
        this.listLoading = true
        try {
          const { rows } = await getMarketWarnList(this.query)
          this.list = rows.splice(0, 5)
        } catch (error) {
          console.error(error)
          this.$notice.danger({
            title: '加载失败',
            desc: error
          })
        }
        this.listLoading = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .tip-market-warn {

  }
</style>
