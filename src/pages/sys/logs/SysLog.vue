<template>
  <page-header-wrap>
    <v-table-wrap>
      <!--查询条件-->
      <v-filter-bar>
        <v-filter-item title="操作名称">
          <b-input v-model.trim="listQuery.operateName" size="small" placeholder="请输入" clearable></b-input>
        </v-filter-item>
        <v-filter-item title="模块名称">
          <b-input v-model.trim="listQuery.moduleName" size="small" placeholder="请输入" clearable></b-input>
        </v-filter-item>
        <!--添加查询按钮位置-->
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
      </v-filter-bar>
      <!--中央表格-->
      <b-table :columns="columns" :data="list" :loading="listLoading"></b-table>
      <!--下方分页器-->
      <b-page :total="total" show-sizer
              @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
    </v-table-wrap>
  </page-header-wrap>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/sys/sys-log.api'

  export default {
    name: 'SysLog',
    mixins: [commonMixin, permission],
    data() {
      return {
        listQuery: {
          operateName: ''
        },
        columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h('v-simple-label', { props: { label: '操作结果' }, style: { padding: 0 } }, params.row.actionResult)
            }
          },
          { title: '操作名称', key: 'operateName' },
          { title: '模块名称', key: 'moduleName' },
          { title: '操作人员', key: 'loginName' },
          { title: '操作时间', width: 180, key: 'operateDate', align: 'center' },
          { title: '远程地址', key: 'remoteAddress', align: 'center' }
        ],
        current: null
      }
    },
    created() {
      this.searchList()
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          operateName: '',
          moduleName: ''
        }
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getLogList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      }
    }
  }
</script>
