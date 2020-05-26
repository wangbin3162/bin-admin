<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!-- 查询条件 -->
        <v-filter-bar>
          <v-filter-item title="报告名称" :span="5">
            <b-input v-model="listQuery.reportName" placeholder="请输入名称"></b-input>
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
          <b-button type="primary" icon="ios-add-circle-outline">添加</b-button>
        </v-table-tool-bar>

        <!-- table -->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:reportName="{ row }">
            <b-button type="text">{{ row.reportName }}</b-button>
          </template>

          <template v-slot:reportType="{ row }">
            <b-button type="text">{{ reportTypeEnum[row.reportType] }}</b-button>
          </template>

          <template v-slot:personClass="{ row }">
            <b-button type="text">{{ personClassEnum[row.personClass] }}</b-button>
          </template>

          <template v-slot:reportDefault="{ row }">
            <b-button type="text">{{ reportDefaultEnum[row.reportDefault] }}</b-button>
          </template>

          <template v-slot:action="{ row }">
            <b-button type="text" @click="handleModify(row)">
              各种操作
            </b-button>
          </template>
        </b-table>
        <!-- 分页器 -->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>

  </div>
</template>

<script>
  import commonMixin from '../../../../common/mixins/mixin'
  import permission from '../../../../common/mixins/permission'
  import { getEvalCommonStatus, getEvalReportType } from '../../../../api/enum.api'
  import { getCreditReportList } from '../../../../api/sys/data-config.api'

  export default {
    name: 'CreditReportConfig',
    mixins: [commonMixin, permission],
    components: {
    },
    data () {
      return {
        personClassEnum: { // 此处主题类别就两种类型
          A01: '自然人',
          A02: '社会法人'
        },
        detail: '', // 存储行数据
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
          { title: '状态', slot: 'reportDefault', align: 'center' },
          { title: '操作', slot: 'action', align: 'center' }
        ]
      }
    },
    computed: {
      reportDefaultEnum () {
        return this.$store.state.creditReportConfig.reportDefaultEnum
      },
      reportTypeEnum () {
        return this.$store.state.creditReportConfig.reportTypeEnum
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
        // this.editData = row
        // this.openEditPage('modify')
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
          const [reportDefaultEnum, reportTypeEnum] = await Promise.all([getEvalCommonStatus(), getEvalReportType()])
          this.$store.commit('SET_REPORT_DEFAULT_ENUM', reportDefaultEnum)
          this.$store.commit('SET_REPORT_TYPE_ENUM', reportTypeEnum)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>
