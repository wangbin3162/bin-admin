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
    <b-modal v-model="detailVisible" class-name="table-page-detail-modal"
             :title="modalTitle" footer-hide width="1300" :mask-closable="false">
      <title-bar tip-pos="left" :font-size="18" :label="modalTitle" slot="header"></title-bar>
      <b-scrollbar style="height: 100%;">
        <key-label-wrap style="margin:0 10px;">
          <key-label
              v-for="col in detailColumns" :key="col.key"
              is-full :label="col.title" label-width="155px">
            {{ detailObj[col.key] | valueFilter }}
          </key-label>
        </key-label-wrap>
      </b-scrollbar>
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
      },
      title: {
        type: String
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
        detailVisible: false,
        detailColumns: [],
        detailObj: null
      }
    },
    computed: {
      ...mapGetters(['queryData']),
      modalTitle () {
        return this.title ? this.title + ' - 详情' : '信息详情'
      }
    },
    watch: {
      resourceKey: {
        handler (value) {
          if (value.length > 0) {
            this.listQuery.personId = this.queryData.id
            this.listQuery.type = this.queryData.type
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
      handlePageChange () {
        this.fetchData()
      },
      // 查看详情
      handleCheck (row) {
        api.getQueryDetail(row.id, this.resourceKey, this.queryData.type).then(res => {
          if (res.data.code === '0') {
            this.detailColumns = res.data.columns
            this.detailObj = res.data.data
            this.detailVisible = true
          }
        })
      }
    },
    filters: {
      valueFilter (value) {
        if (!value || value.toString().length === 0) {
          return '-'
        }
        return value
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
