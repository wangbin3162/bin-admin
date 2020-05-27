<template>
  <div>
    <page-header-wrap title="信息类配置" show-close @on-close="$emit('close')" v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar>
           <v-filter-item title="信息类类别">
            <b-select v-model="listQuery.category" clearable>
              <b-option v-for="(value, key) in reportItemTypeEnum" :key="key" :value="key">
                {{ value }}
              </b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>

        <!-- 操作栏 -->
        <v-table-tool-bar>
          <b-button type="primary" icon="ios-add-circle-outline"
            @click="handleCreate">添加</b-button>
        </v-table-tool-bar>

        <!-- table -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:category="{ row }">
            {{ reportItemTypeEnum[row.category] }}
          </template>

          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleModify(row)">
              修改
            </b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" text-color="danger"
              @click="handleRemove(row.id)">
              删除
            </b-button>
          </template>
        </b-table>
        <!-- 分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

    <edit v-if="isEdit"
      :reportId="reportId"
      :editData="detail"
      @close="handleEditClose"
      @success="searchList"></edit>

    <!-- <detail v-if="isCheck"
      :title="editTitle"
      :detail="detail"
      @close="handleEditClose"></detail> -->
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import Edit from './Edit'
  // import Detail from './Detail'
  import { getEvalReportItemType, getEvalReportLayoutType } from '../../../../../api/enum.api'
  import { getInfoClassList } from '../../../../../api/sys/credit-report-config.api'

  export default {
    name: 'CreditReportConfigInfoClass',
    mixins: [commonMixin, permission],
    props: ['reportId'],
    components: {
      Edit
      // Detail
    },
    data () {
      return {
        detail: null, // 存储行数据
        listQuery: {
          reportId: this.id,
          category: ''
        },
        columns: [
          { type: 'selection', width: 50, align: 'center' },
          { title: '信息类名称', key: 'displayName', align: 'center' },
          { title: '信息类类别', slot: 'category', align: 'center' },
          { title: '信息项名称', key: 'resourceName', align: 'center' },
          { title: '所属报告配置', key: 'reportId', align: 'center' },
          { title: '排序编码', key: 'orderNo', align: 'center' },
          { title: '操作', slot: 'action', align: 'center' }
        ]
      }
    },
    computed: {
      reportItemTypeEnum () {
        return this.$store.state.creditReportConfig.reportItemTypeEnum
      }
    },
    created () {
      this.getEnum()
      this.searchList()
    },
    methods: {
      resetQuery () {
        this.listQuery = {
          category: '',
          page: 1,
          size: 10
        }
        this.searchList()
      },
      handleCreate () {
        this.openEditPage('create')
      },
      handleCheck (row) {
        this.detail = row
        this.openEditPage('check')
      },
      handleModify (row) {
        this.detail = row
        this.openEditPage('modify')
      },
      // 删除按钮回调
      handleRemove (id) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前报告配置？',
          loading: true,
          okType: 'danger',
          onOk: async () => {
            try {
              // await deleteCreditReport(id)
              this.$message({ type: 'success', content: '操作成功' })
              this.searchList()
            } catch (error) {
              this.$notice.danger({ title: '操作错误', desc: error })
            }
            this.$modal.remove()
          }
        })
      },
      // 编辑组件关闭回调
      handleEditClose () {
        this.detail = null
        this.handleCancel()
      },
      async searchList () {
        this.listLoading = true
        try {
          const res = await getInfoClassList(this.listQuery)
          this.setListData({
            list: res.rows,
            total: res.total
          })
        } catch (error) {
          console.error(error)
        }
        this.listLoading = false
      },
      // 获取需要的枚举值，并存入vuex
      async getEnum () {
        try {
          const [reportItemTypeEnum, reportLayoutTypeEnum] = await Promise.all([getEvalReportItemType(), getEvalReportLayoutType()])
          this.$store.commit('SET_REPORT_ITEM_TYPE_ENUM', reportItemTypeEnum)
          this.$store.commit('SET_REPORT_LAYOUT_TYPE_ENUM', reportLayoutTypeEnum)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>
