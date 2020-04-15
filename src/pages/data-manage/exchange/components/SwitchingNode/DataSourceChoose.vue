<template>
  <!--数据源选择框 for switching-node -->
  <div style="width: 100%;">
    <div flex="box:last">
      <b-input v-model="current" placeholder="选择填充" readonly clearable @on-clear="handleClear"></b-input>
      <b-button type="primary" @click="handleShowModal">
        选择
      </b-button>
    </div>
    <b-modal v-model="dialogFormVisible" title="选择数据源" width="860" :mask-closable="false">
      <div>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="数据源名称" :span="8">
            <b-input v-model="listQuery.dataSourceName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading" size="small">
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" @click="chooseOne(scope.row)">选择</b-button>
          </template>
        </b-table>
      </div>
      <div slot="footer">
        <!--下方分页器-->
        <b-page :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange"/>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import { getDataSourceList } from '../../../../../api/data-manage/data-source.api'

  export default {
    name: 'DataSourceChoose',
    mixins: [commonMixin, permission],
    props: {
      value: {
        type: String,
        default: ''
      },
      defaultName: {
        type: String,
        default: ''
      }
    },
    watch: {
      value: {
        handler(val) {
          if (val === '') {
            this.current = ''
          }
        },
        immediate: true
      },
      defaultName: {
        handler(val) {
          this.current = val
        },
        immediate: true
      }
    },
    data() {
      return {
        dialogFormVisible: false,
        listQuery: {
          dataSourceName: '', // 名称
          dbType: ''
        },
        columns: [
          { title: '数据源名称', key: 'dataSourceName' },
          { title: '连接类型', key: 'dbType', align: 'center', width: 120 },
          { title: '数据库名称', key: 'dbName', align: 'center', width: 120 },
          { title: '连接驱动', key: 'driverClass' },
          { title: '操作', slot: 'action', width: 100 }
        ],
        current: ''
      }
    },
    methods: {
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          dataSourceName: '', // 名称
          dbType: ''
        }
        this.handleFilter()
      },
      handleShowModal() {
        this.dialogFormVisible = true
        this.resetQuery()
      },
      chooseOne(item) {
        this.current = item.dataSourceName
        this.$emit('input', item.id)
        this.dialogFormVisible = false
      },
      // 清空时触发调用
      handleClear() {
        this.current = ''
        this.$emit('input', '')
      },
      // 查询所有数据源信息
      searchList() {
        this.setListData()
        getDataSourceList(this.listQuery).then(response => {
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
