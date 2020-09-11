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
        <template v-slot:action="{ row }">
          <b-button type="text" @click="handleViewBtn(row)">
            查看
          </b-button>
        </template>
      </b-table>

      <div flex="main:right" class="mt-20 mb-5">
        <b-page :total="total" :page-size="query.size"
          :current.sync="query.page"
          show-elevator
          @on-change="handlePageChange">
        </b-page>
     </div>
    </b-card>

    <detail-modal v-model="open"
      :id="curRow.id"
      :resourceKey="curRow.resourcekey"
      :title="curRow.resourceName">
    </detail-modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { arrPgination } from '@/common/utils/util'
  import DetailModal from '@/pages/credit-supervision/components/DetailModal'

  export default {
    name: 'RedBlackListInfo',
    components: {
      DetailModal
    },
    data () {
      return {
        open: false,
        listLoading: false,
        total: 0,
        query: {
          size: 10,
          page: 1
        },
        columns: [
          { title: '资源名称', key: 'resourceName' },
          { title: '创建部门', key: 'createDept' },
          { title: '创建日期', key: 'createDate' },
          { title: '操作', slot: 'action', width: 70 }
        ],
        list: [],
        curRow: {}
      }
    },
    computed: {
      ...mapState({
        redBlackListInfo: state => state.creSupDetail.redBlackListInfo
      })
    },
    watch: {
      redBlackListInfo: {
        handler (newVal) {
          this.getList(newVal, this.query)
        },
        immediate: true
      }
    },
    created () {

    },
    methods: {
      /**
       * @author haodongdong
       * @description 静态分页
       * @param {Array} array 需要分页的数组
       * @param {Object} query 分页参数
       * @param {number} query.size 分页大小
       * @param {number} query.page 当前页
       */
      getList (array, query) {
        const { total, page, arr } = arrPgination(array, query.size, query.page)
        this.total = total
        this.list = arr
      },

      /**
       * @author haodongdong
       * @description 查看按钮回调
       * @param {Object} row 当前行数据
       */
      handleViewBtn (row) {
        this.curRow = row
        this.open = true
      },

      /**
       * @author haodongdong
       * @description 分页组件页面改变回调
       * @param {number} page 当前页
       */
      handlePageChange (page) {
        this.query.page = page
        this.getList(this.redBlackListInfo, this.query)
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .red-black-list-info {

 }
</style>
