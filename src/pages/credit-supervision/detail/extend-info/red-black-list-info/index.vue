<template>
  <div class="red-black-list-info">
    <b-card head-tip shadow="never"
      :bordered="false" divider="no"
      :body-style="{ padding: 0 }">
      <template v-slot:header>
          <div flex="main:justify cross:center">
            <span>红黑名单信息</span>
          </div>
      </template>

      <b-table :columns="columns" :data="list" :loading="listLoading">
        <template v-slot:action>
          <b-button type="text">
            查看
          </b-button>
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
  import { getRedBlackOrFocusScope } from '@/api/credit-supervision/detail.api'

  export default {
    name: 'RedBlackListInfo',
    data () {
      return {
        listLoading: false,
        total: 0,
        query: {
          personId: '',
          size: 10,
          page: 1
        },
        columns: [
          { title: '资源名称', key: 'resourceName' },
          { title: '创建部门', key: 'createDept' },
          { title: '创建日期', key: 'createDate' },
          { title: '操作', slot: 'action', width: 70 }
        ],
        list: []
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
        const query = this.$route.query
        this.query.personId = query.id
        this.getRedBlackOrFocusScope(this.query)
      },

      /**
       * @author haodongdong
       * @description 获取红黑名单信息
       * @param {Object} query 查询参数对象
       * @param {string} query.personId 主体id
       * @param {number} query.size 分页大小
       * @param {number} query.page 当前页
       */
      async getRedBlackOrFocusScope (query) {
        this.listLoading = true
        try {
          const { total, rows } = await getRedBlackOrFocusScope(query)
          this.total = total
          this.list = rows
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
 .red-black-list-info {

 }
</style>
