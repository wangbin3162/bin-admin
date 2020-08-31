<template>
  <div class="tip-industry-black-list">
    <b-card head-tip shadow="never"
      :body-style="{ padding: 0 }" divider="no">
      <div slot="header" flex="main:justify">
        <span>行业黑名单排行</span>
        <b-button type="text"
          @click="$router.push('/creditSupervision/industryBlackList')">
          更多>>
        </b-button>
      </div>

      <b-table :columns="columns" :data="list" size="small">
      </b-table>
    </b-card>
  </div>
</template>

<script>
  import { getIndustryBlackList } from '@/api/credit-supervision/industry-black-list.api'

  export default {
    name: 'TipIndustryBlackList',
    data () {
      return {
        listLoading: false,
        query: {
          size: 10,
          page: 1
        },
        list: [],
        columns: [
          { title: '行业名称', key: 'name', ellipsis: true, tooltip: true, align: 'left' },
          { title: '黑名单数量', key: 'count', align: 'center' },
          { title: '占比', key: 'ratio', align: 'center' }
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
          const { rows } = await getIndustryBlackList(this.query)
          rows.forEach(item => {
            if (item.ratio) {
              item.ratio = (item.ratio * 100).toFixed(2) + '%'
            } else {
              item.ratio = '0%'
            }
          })
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
  .tip-industry-black-list {

  }
</style>
