<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar @keydown.enter.native="handleFilter">
          <v-filter-item title="申请目录">
            <b-input v-model="listQuery.resourceName" placeholder="请输入申请目录"></b-input>
          </v-filter-item>
           <v-filter-item title="主体名称">
            <b-input v-model="listQuery.name" placeholder="请输入主体名称"></b-input>
          </v-filter-item>
          <v-filter-item title="状态">
            <b-select v-model="listQuery.status">
              <b-option v-for="(value, key) in statusEnum" :key="key"
                :value="key">
                {{ value }}
              </b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button type="primary" icon="ios-add-circle-outline" @click="handleCreate">修复申请</b-button>
        </v-table-tool-bar>

        <!-- table -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:dealMode="{ row }">
            {{ dealModeEnum[row.dealMode] || '申请修复' }}
          </template>

          <template v-slot:status="{ row }">
            {{ statusEnum[row.status] }}
          </template>

          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleCheck(row)">
              查看
            </b-button>
            <!-- 待审核的可以删除 -->
            <template v-if="row.status === '1'">
              <b-button type="text" @click="handleModify(row)">
                审核
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

    <edit v-if="isEdit"
      @close="handleClose"
      @success="searchList"
      :title="editTitle"
      :id="curRow.id">
    </edit>

    <detail v-if="isCheck"
      @close="handleClose"
      :title="editTitle"
      :id="curRow.id">
    </detail>
  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import { getRepairApplyList, deleteRepairApply } from '../../../../api/credit-service/credit-repair.api'
  import Edit from './Edit'
  import Detail from './Detail'

  export default {
    name: 'RepairAudit',
    mixins: [commonMixin, permission],
    components: {
      Edit,
      Detail
    },
    data () {
      return {
        moduleName: '信用修复申请',
        curRow: null, // 当前行数据
        listQuery: {
          resourceName: '',
          name: '',
          status: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '申请目录', key: 'resourceName' },
          { title: '主体名称', key: 'name' },
          { title: '修复原因', key: 'repairCause' },
          { title: '处理方式', slot: 'dealMode' },
          { title: '申请人', key: 'applyName' },
          { title: '申请部门', key: 'applyDeptName' },
          { title: '申请时间', key: 'applyDate' },
          { title: '当前状态', slot: 'status' },
          { title: '操作', slot: 'action', width: 120 }
        ]
      }
    },
    computed: {
      statusEnum () {
        return this.$store.state.creditRepair.statusEnum
      },
      dealModeEnum () {
        return this.$store.state.creditRepair.dealModeEnum
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
      // 查看按钮回调
      handleCheck (row) {
        this.curRow = row
        this.openEditPage('check')
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
              await deleteRepairApply(id)
              this.$message({ type: 'success', content: '操作成功' })
              this.searchList()
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
          const res = await getRepairApplyList(this.listQuery)

          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.error(error)
        }
        this.listLoading = false
      }
    }
  }
</script>
