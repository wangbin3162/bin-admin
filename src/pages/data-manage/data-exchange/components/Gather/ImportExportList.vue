<template>
  <div>
    <page-header-wrap v-show="visible && !detailDialog" show-close @on-close="close" title="导入/导出记录">
      <v-table-wrap>
        <!--查询条件-->
        <v-filter-bar>
          <v-filter-item title="类型">
            <b-select v-model="listQuery.jobType" clearable>
              <b-option v-for="(value,key) in jobTypeMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="时间">
            <b-date-picker type="daterange" placeholder="选择日期"
                           ref="datePickerRange"
                           @on-change="dateChange"></b-date-picker>
          </v-filter-item>
          <v-filter-item title="状态">
            <b-select v-model="listQuery.status" clearable>
              <b-option v-for="(value,key) in statusMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <template v-slot:jobType="{row}">
            <b-icon v-if="row.jobType==='EXPORT'" name="ios-log-out" size="22" color="#ff7072"/>
            <b-icon v-if="row.jobType==='IMPORT'" name="ios-log-in" size="22" color="#74cf47"/>
            {{ jobTypeMap[row.jobType] }}
          </template>
          <template v-slot:jobStatus="{row}">
            <b-tag v-if="row.jobStatus" :type="statusStyleMap[row.jobStatus]" no-border dot
                   :tag-style="{background:'transparent',color:'rgba(0,0,0,.65)'}">
              {{ statusMap[row.jobStatus] }}
            </b-tag>
          </template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <b-button type="text" @click="handleCheckImport(row.id)">
              查看
            </b-button>
            <b-button v-if="jobTypeMap[row.jobType]===jobTypeMap.EXPORT" type="text"
                      :disabled="row.jobStatus!=='COMPLETED'"
                      @click="handleDownloadExport(row.id)">
              下载
            </b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="detailDialog" show-close @on-close="detailDialog=false" title="导入详情">
      <v-edit-wrap transparent>
        <b-collapse-wrap v-if="detail" :title="jobTypeMap[detail.jobType]+'信息'">
          <div class="detail">
            <b-row>
              <b-col span="24">
                <v-simple-label label="状态">
                  <b-tag :type="statusStyleMap[detail.jobStatus]" :tag-style="{borderRadius: '30px'}">
                    {{ statusMap[detail.jobStatus] }}
                  </b-tag>
                </v-simple-label>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="6">
                <v-simple-label label="创建用户">{{ detail.createName }}</v-simple-label>
              </b-col>
              <b-col span="6">
                <v-simple-label label="创建部门">{{ detail.createDeptName }}</v-simple-label>
              </b-col>
              <b-col span="6">
                <v-simple-label label="导入时间">{{ detail.createDate }}</v-simple-label>
              </b-col>
              <b-col span="6">
                <v-simple-label label="完成时间">{{ detail.finishDate }}</v-simple-label>
              </b-col>
            </b-row>
            <b-row>
              <b-col span="6">
                <v-simple-label label="数据总量">{{ detail.totalCount }}</v-simple-label>
              </b-col>
              <b-col span="6">
                <v-simple-label label="错误数据量">
                  {{ detail.errorCount }}
                  <b-button type="text" v-if="detail.errorCount>0" @click="handleDownloadImportFile(detail.id)">
                    下载：错误数据
                  </b-button>
                </v-simple-label>
              </b-col>
              <b-col span="6">
                <v-simple-label label="重复数据量">{{ detail.repeatCount }}</v-simple-label>
              </b-col>
              <b-col span="6">
                <v-simple-label label="有效数据量">{{ detail.validCount }}</v-simple-label>
              </b-col>
            </b-row>
          </div>
        </b-collapse-wrap>
        <b-collapse-wrap title="错误数据信息" v-if="errDataColumns.length>0">
          <b-table :columns="errDataColumns" :data="errDataRows" size="small"></b-table>
        </b-collapse-wrap>
        <template slot="footer">
          <b-button @click="detailDialog=false">返 回</b-button>
        </template>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import * as api from '../../../../../api/data-manage/gather.api'
  import Util from '../../../../../common/utils/util'

  export default {
    name: 'ImportExportList',
    mixins: [commonMixin, permission],
    data() {
      return {
        visible: false,
        detailDialog: false,
        listQuery: {
          jobType: '', // 任务类型
          beginTime: '', // 开始时间
          endTime: '', // 结束时间
          status: ''
        },
        columns: [
          { type: 'index', width: 70, align: 'center' },
          { title: '任务名称', key: 'jobName' },
          { title: '类型', slot: 'jobType', align: 'center' },
          { title: '创建时间', key: 'createDate' },
          { title: '所属组织', key: 'createDeptName' },
          { title: '状态', slot: 'jobStatus', width: 150 },
          { title: '操作', slot: 'action', width: 100 }
        ],
        statusMap: { COMPLETED: '完成', STARTED: '正在进行中', FAILED: '失败', REPEATING: '重复性验证' },
        statusStyleMap: { COMPLETED: 'success', STARTED: 'primary', FAILED: 'danger', REPEATING: 'warning' },
        jobTypeMap: { IMPORT: '导入', EXPORT: '导出' },
        detail: null, // 文件导入信息详情
        errDataColumns: [],
        errDataRows: [] // 导入错误数据信息
      }
    },
    methods: {
      open(resource) {
        this.resourceKey = resource.resourceKey
        this.resourceName = resource.resourceName
        this.resetQuery()
        // 查询成功时打开
        this.visible = true
      },
      close() {
        this.visible = false
        this.$emit('on-close')
      },
      // 日期改变事件
      dateChange(date) {
        // 给开始和结束时间设置值
        this.listQuery.beginTime = date[0]
        this.listQuery.endTime = date[1]
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          jobType: '',
          beginTime: '', // 开始时间
          endTime: '', // 结束时间
          status: ''
        }
        // 清空日期范围
        this.$refs.datePickerRange && this.$refs.datePickerRange.handleClear()
        this.handleFilter()
      },
      // 查询方法
      searchList() {
        this.setListData()
        api.exchangeQueryList(this.listQuery, this.resourceKey).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      // 查看导入文件详情
      handleCheckImport(id) {
        this.detail = null // 清空数据
        this.errDataColumns = []
        this.errDataRows = []
        api.queryImportDetails(id).then(res => {
          if (res.data.code === '0') {
            this.detail = res.data.data
            this.detailDialog = true
            // 如果存在错误数据下载则再请求读取错误列表
            if (this.detail.errorCount && this.detail.errorCount > 0) {
              api.queryErrorExcelInfo(id).then(res => {
                if (res.data.code === '0') {
                  let { columns, rows } = res.data.data
                  if (columns && rows) {
                    this.errDataColumns = this.formatColumns(columns)
                    this.errDataRows = rows
                  }
                }
              })
            }
          } else {
            this.$notice.danger({ title: '操作错误', desc: res.data.message })
          }
        })
      },
      // 格式化columns
      formatColumns(columns) {
        let arr = []
        Object.keys(columns).forEach(key => {
          arr.push({ title: columns[key], key, tooltip: true })
        })
        return arr
      },
      // 下载导入文件
      handleDownloadImportFile(id) {
        if (!this.downloadImportEvent) {
          this.downloadImportEvent = this.$util.debounce((id) => {
            api.downloadImport(id).then(res => {
              if (res.status === 200) {
                Util.downloadFile(res.data, `${this.resourceName}-error.xlsx`)
              }
            })
          }, 1000)
        }
        this.downloadImportEvent(id)
      },
      // 下载导出文件
      handleDownloadExport(id) {
        if (!this.downloadEvent) { // 点击下载事件，需要函数防抖动
          this.downloadEvent = this.$util.debounce((id) => {
            api.downloadExport(id).then(res => {
              if (res.status === 200) {
                Util.downloadFile(res.data, `${this.resourceName}.xlsx`)
              }
            })
          }, 1000)
        }
        this.downloadEvent(id)
      }
    }
  }
</script>
