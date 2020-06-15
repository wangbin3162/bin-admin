<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="资源名称">
            <b-input v-model="listQuery.resourceName" placeholder="请输入资源名称"></b-input>
          </v-filter-item>
           <v-filter-item title="资源表名">
            <b-input v-model="listQuery.tableName" placeholder="请输入资源表名"></b-input>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button type="primary" icon="ios-add-circle-outline" @click="handleCreate">新 增</b-button>
        </v-table-tool-bar>
        <b-table :columns="columns" :data="list" :loading="listLoading">

          <template v-slot:configType="{ row }">
            {{ configTypeEnum[row.configType] }}
          </template>

          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleModify(row)">
              修改
            </b-button>
            <template>
              <b-divider type="vertical"></b-divider>
              <b-button type="text" text-color="danger" @click="handleRemove(row.id)">
                删除
              </b-button>
            </template>
          </template>
        </b-table>
        <!-- 分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

    <!-- 编辑组件 -->
    <edit v-if="isEdit"
      @close="handleClose"
      @success="searchList"
      :title="editTitle"
      :editData="curRow">
    </edit>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import Edit from './Edit'
  import { getDirConfigList, deleteDirConfig } from '../../../../api/credit-service/credit-repair.api'

  export default {
    name: 'DirConfig',
    mixins: [commonMixin, permission],
    components: {
      Edit
    },
    data () {
      return {
        moduleName: '信用目录配置',
        curRow: null, // 当前行数据
        listQuery: {
          resourceName: '',
          tableName: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '资源名称', key: 'resourceName' },
          { title: '资源标识', key: 'resourceKey' },
          { title: '资源表名', key: 'tableName' },
          { title: '配置类别', slot: 'configType' },
          { title: '备注', key: 'bz', ellipsis: true, tooltip: true },
          { title: '操作', slot: 'action', width: 120 }
        ]
      }
    },
    computed: {
      configTypeEnum () {
        return this.$store.state.creditRepair.configTypeEnum
      }
    },
    created () {
      this.searchList()
    },
    methods: {
      resetQuery () {
        this.listQuery = {
          page: 1,
          size: 10,
          varName: '',
          varType: ''
        }
        this.searchList()
      },
      handleCreate () {
        this.openEditPage('create')
      },
      handleModify (row) {
        this.curRow = row
        this.openEditPage('modify')
      },
      handleRemove (id) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前目录配置吗？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              const [success, errorMsg] = await deleteDirConfig(id)
              if (success) {
                this.$message({ type: 'success', content: '操作成功' })
                this.searchList()
              } else {
                this.$notice.danger({ title: '操作错误', desc: errorMsg })
              }
            } catch (error) {
              this.$notice.danger({ title: '操作错误', desc: error })
            }
            this.$modal.remove()
          }
        })
      },
      // 处理编辑框关闭事件
      handleClose () {
        // 清空可能存在的待编辑数据
        this.curRow = null
        this.handleCancel()
      },
      async searchList () {
        this.listLoading = true
        try {
          const res = await getDirConfigList(this.listQuery)

          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.log(error)
        }
        this.listLoading = false
      }
    }
  }
</script>
