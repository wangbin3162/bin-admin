<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="报告名称" :span="5">
            <b-input v-model="listQuery.reportName" placeholder="请输入名称" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="报告类型" :span="5">
            <b-select v-model="listQuery.reportType" clearable>
              <b-option v-for="(value, key) in reportTypeEnum" :key="key" :value="key">
                {{ value }}
              </b-option>
            </b-select>
          </v-filter-item>
           <v-filter-item title="主体类别" :span="4">
            <b-select v-model="listQuery.personClass" clearable>
              <b-option v-for="(value, key) in personClassEnum" :key="key" :value="key">
                {{ value }}
              </b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="状态" :span="4">
            <b-select v-model="listQuery.reportDefault" clearable>
              <b-option v-for="(value, key) in reportDefaultEnum" :key="key" :value="key">
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
          <template v-slot:reportName="{ row }">
            <b-button type="text" @click="handleCheck(row)">{{ row.reportName }}</b-button>
          </template>

          <template v-slot:reportType="{ row }">
            {{ reportTypeEnum[row.reportType] }}
          </template>

          <template v-slot:personClass="{ row }">
            {{ personClassEnum[row.personClass] }}
          </template>

          <template v-slot:sysDefault="{ row }">
            {{ defaultEnum[row.sysDefault] }}
          </template>

          <template v-slot:reportDefault="{ row }">
            <b-switch :value="row.reportDefault"
              true-value="Y" false-value="D"
              inactive-color="#ff4949"
              @on-change="handleSwitch($event, row.id)">
              <!-- <span slot="open">启用</span>
              <span slot="close">禁用</span> -->
            </b-switch>
          </template>

          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleModify(row)">
              修改
            </b-button>
            <b-divider type="vertical"></b-divider>
            <b-button type="text" @click="handleTempPre(row)" :disabled="btnLoading">
              <template v-if="btnLoading">
                <b-icon name="loading2" class="icon-is-rotating"></b-icon>生成中
              </template>
              <template v-else>
                模板预览
              </template>
            </b-button>
            <b-divider type="vertical"></b-divider>
            <b-dropdown append-to-body>
              <b-button type="text">
                更多
                <b-icon name="ios-arrow-down"></b-icon>
              </b-button>
              <b-dropdown-menu slot="list">
                <b-dropdown-item :style="colorPrimary" @click.native="handleDefault(row)">
                  设为默认
                </b-dropdown-item>

                <b-dropdown-item :style="colorPrimary" @click.native="handleInfoClass(row)">
                  信息类
                </b-dropdown-item>

                <b-dropdown-item :style="colorDanger" @click.native="handleRemove(row.id)">
                  删除
                </b-dropdown-item>
              </b-dropdown-menu>
            </b-dropdown>
          </template>
        </b-table>
        <!-- 分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

    <edit v-if="isEdit"
      :editData="detail"
      @close="handleClose"
      @success="searchList">
    </edit>

    <detail v-if="isCheck"
      :title="editTitle"
      :detail="detail"
      @close="handleClose">
    </detail>

    <info-class  v-if="dialogStatus === 'infoClass'"
      @close="handleClose"
      :configId="detail.id"
      :reportName="detail.reportName"
      :personClass="detail.personClass">
    </info-class>

    <p-d-f
      @close="openPDF = false"
      :open="openPDF"
      :pdfBlob="pdfBlob">
    </p-d-f>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import { getEvalCommonStatus, getEvalReportType, getEvalSysDefault } from '../../../api/enum.api'
  import { getCreditReportList, deleteCreditReport, changeStatus, setDefault } from '../../../api/credit-rating/credit-report-config.api'
  import { exportPDF } from '../../../api/import-export.api'
  import Edit from './Edit'
  import Detail from './Detail'
  import InfoClass from './info-class'
  import PDF from '../model-count/components/PDF'

  export default {
    name: 'CreditReportConfig',
    mixins: [commonMixin, permission],
    components: {
      Edit,
      Detail,
      InfoClass,
      PDF
    },
    data () {
      return {
        btnLoading: false,
        detail: null, // 存储行数据
        openPDF: false, // 打开p-d-f组件
        pdfBlob: null, // 存储re-count组件返回的pdfBlob
        listQuery: {
          reportName: '',
          reportType: '',
          personClass: '',
          reportDefault: ''
        },
        columns: [
          { title: '报告名称', slot: 'reportName', align: 'center' },
          { title: '报告类型', slot: 'reportType', align: 'center' },
          { title: '主体类别', slot: 'personClass', align: 'center' },
          { title: '默认方案', slot: 'sysDefault', align: 'center' },
          { title: '状态', slot: 'reportDefault', align: 'center' },
          { title: '操作', slot: 'action', width: 210, align: 'center' }
        ]
      }
    },
    computed: {
      personClassEnum () {
        return this.$store.state.creditReportConfig.personClassEnum
      },
      reportDefaultEnum () {
        return this.$store.state.creditReportConfig.reportDefaultEnum
      },
      reportTypeEnum () {
        return this.$store.state.creditReportConfig.reportTypeEnum
      },
      defaultEnum () { // 缺省模型枚举
        return this.$store.state.creditReportConfig.defaultEnum
      }
    },
    created () {
      this.getEnum()
      this.searchList()
    },
    methods: {
      resetQuery () {
        this.listQuery = {
          reportName: '',
          reportType: '',
          personClass: '',
          reportDefault: '',
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
      // 设为默认按钮回调
      async handleDefault (row) {
        try {
          await setDefault(row.id)
          this.searchList()
          this.$message({ type: 'success', content: '操作成功' })
        } catch (error) {
          this.$notice.danger({ title: '操作失败', desc: error })
        }
      },
      // 信息类按钮回调
      handleInfoClass (row) {
        this.detail = row
        this.dialogStatus = 'infoClass'
      },
      // 模板预览按钮回调
      async handleTempPre (row) {
        await this.exportPDF(row)
      },
      // 状态switch开关回调
      async handleSwitch (value, id) {
        try {
          await changeStatus(id)
          this.$message({ type: 'success', content: '操作成功' })
        } catch (error) {
          this.$notice.danger({ title: '操作失败', desc: error })
        }
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
              await deleteCreditReport(id)
              this.$message({ type: 'success', content: '操作成功' })
              this.searchList()
            } catch (error) {
              this.$notice.danger({ title: '操作错误', desc: error })
            }
            this.$modal.remove()
          }
        })
      },
      // 编辑、信息类组件关闭回调
      handleClose () {
        this.detail = null
        this.handleCancel()
      },
      async searchList () {
        this.listLoading = true
        try {
          const res = await getCreditReportList(this.listQuery)
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
          const [reportDefaultEnum, reportTypeEnum, defaultEnum] = await Promise.all([
            getEvalCommonStatus(), getEvalReportType(), getEvalSysDefault()
          ])
          this.$store.commit('SET__DEFAULT_ENUM', defaultEnum)
          this.$store.commit('SET_PERSON_CLASS_ENUM', { // 此处主题类别就两种类型
            A01: '自然人',
            A02: '法人和其他组织'
          })
          this.$store.commit('SET_REPORT_DEFAULT_ENUM', reportDefaultEnum)
          this.$store.commit('SET_REPORT_TYPE_ENUM', reportTypeEnum)
        } catch (error) {
          console.error(error)
        }
      },
      async exportPDF (row) {
        this.btnLoading = true
        try {
          const pdfBlob = await exportPDF({
            personId: '', // 空字符串表示预览
            configId: row.id,
            maskCode: true,
            modelName: ''
          })
          this.pdfBlob = pdfBlob
          this.openPDF = true
        } catch (error) {
          console.error(error)
          this.$notice.danger({ title: '预览失败', desc: error })
        }
        this.btnLoading = false
      }
    }
  }
</script>
