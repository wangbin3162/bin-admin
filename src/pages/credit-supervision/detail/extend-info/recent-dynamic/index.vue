<template>
  <div class="recent-dynamic">
    <b-card shadow="never">
      <template v-slot:header>
        <div flex="main:justify cross:center">
          <span>企业关联图谱</span>
          <b-button type="text">
            全屏查看 >>
          </b-button>
        </div>
      </template>
    </b-card>

    <b-card head-tip shadow="never"
      :bordered="false" divider="no"
      :body-style="{ padding: 0 }"
      class="mt-20">
      <template v-slot:header>
        <div flex="main:justify cross:center">
          <span>近期动态</span>
          <span class="tip-text">
            近{{ query.month }}月内动态
          </span>
        </div>
      </template>

      <b-table :columns="columns" :data="list" :loading="listLoading">
        <template v-slot:resProperty="{ row }">
          {{ natureEnum[row.resProperty] }}
        </template>

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
    name: 'RecentDynamic',
    components: {
      DetailModal
    },
    data () {
      return {
        open: false,
        listLoading: false,
        total: 0,
        query: {
          month: 1,
          size: 10,
          page: 1
        },
        natureEnum: {
          B01: '正面',
          B02: '负面',
          B03: '中性'
        },
        columns: [
          { title: '资源名称', key: 'resourceName' },
          { title: '资源性质', slot: 'resProperty' },
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
        recentDynamic: state => state.creSupDetail.recentDynamic
      })
    },
    watch: {
      recentDynamic: {
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
        this.getList(this.recentDynamic, this.query)
      }
    }
  }
</script>

<style lang="stylus" scoped>
 .recent-dynamic {
   .tip-text {
     color: #8c8c8c;
   }
 }
</style>
