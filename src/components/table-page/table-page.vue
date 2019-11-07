<template>
  <div class="table-page-wrap">
    <b-table :columns="columns" :data="list" :loading="loading">
      <template v-slot:action="scope">
        <span class="link" @click="handleCheck(scope.row)">查看</span>
      </template>
    </b-table>
    <div class="page">
      <b-page :total="total" :current.sync="listQuery.page" show-total @on-change="handlePageChange"></b-page>
    </div>
    <b-modal v-model="detailVisible" class-name="table-page-detail"
             title="信息详情" footer-hide width="1300">
      <title-bar tip-pos="left" :font-size="18" label="信息详情" slot="header"></title-bar>
      <p>我是弹窗内容...</p>
      <p>我是弹窗内容...</p>
      <p>我是弹窗内容...</p>
    </b-modal>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as api from '../../api/search'

  export default {
    name: 'table-page',
    props: {
      resourceKey: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        listQuery: {
          personId: '', // 当前缓存的personID
          resourceKey: '', // 默认选中的tab，及资源信息key
          type: '',
          page: 1,
          size: 10
        },
        columns: [],
        list: [],
        total: 0,
        loading: false,
        detailVisible: false
      }
    },
    computed: {
      ...mapGetters(['currentDetailId', 'searchData'])
    },
    watch: {
      resourceKey: {
        handler (value) {
          if (value.length > 0) {
            this.listQuery.personId = this.currentDetailId
            this.listQuery.type = this.searchData.type
            this.listQuery.resourceKey = this.resourceKey
            this.listQuery.page = 1
            this.fetchData()
          }
        },
        immediate: true
      }
    },
    methods: {
      // 获取列表数据和page数据等基本数据
      fetchData () {
        this.loading = true
        api.getQueryList(this.listQuery).then(res => {
          // 扩展columns
          this.columns = this.formatColumn(res.data.columns)
          this.list = res.data.rows
          this.total = res.data.total
          this.loading = false
          console.log(res.data)
        })
      },
      // 表格列转换操作
      formatColumn (columns) {
        let ret = []
        ret.push({
          title: '序号',
          type: 'index',
          width: 50,
          align: 'center',
          indexMethod: (row) => {
            return this.listQuery.size * (this.listQuery.page - 1) + row._index + 1
          }
        })
        columns.forEach((col, index) => {
          if (index < 10) {
            ret.push({ title: col.title, key: col.key, tooltip: true })
          }
        })
        ret.push({ title: '操作', slot: 'action', width: 80 })
        return ret
      },
      // 分页改变事件
      handlePageChange (page) {
        console.log(this.listQuery.page)
        console.log(page)
        this.fetchData()
      },
      // 查看详情
      handleCheck (row) {
        this.detailVisible = true
        console.log(row)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .table-page-wrap {
    padding-bottom: 20px;
    .page {
      padding: 15px 0;
      text-align: right;
    }
  }
</style>
