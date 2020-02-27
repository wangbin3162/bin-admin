<template>
  <!--导入导出记录-->
  <b-modal v-model="drawerVisible" append-to-body width="940" class="layout-inner" :mask-closable="false" title="查看记录">
    <v-table-layout>
      <!--查询条件-->
      <v-filter-bar slot="filter">
        <v-filter-item title="类型">
          <b-select v-model="handleType" @on-change="typeChange">
            <b-option value="import">导入记录</b-option>
            <b-option value="export">导出记录</b-option>
          </b-select>
        </v-filter-item>
        <v-filter-item title="时间">
          <b-date-picker type="daterange" placeholder="选择日期" size="small"
                         ref="datePickerRange"
                         @on-change="dateChange"></b-date-picker>
        </v-filter-item>
        <v-filter-item title="状态">
          <b-select v-model="listQuery.status" clearable>
            <b-option v-for="(value,key) in statusMap" :key="key" :value="key">{{ value }}</b-option>
          </b-select>
        </v-filter-item>
        <!--添加查询按钮位置-->
        <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
      </v-filter-bar>
      <!--中央表格-->
      <b-table slot="table" :columns="columns" :data="list" :loading="listLoading"
               stripe ref="table" width="900" size="small">
        <template v-slot:jobStatus="{row}">
          <b-tag v-if="row.jobStatus" :type="statusStyleMap[row.jobStatus]" size="small">
            {{ statusMap[row.jobStatus] }}
          </b-tag>
          <span v-else>-</span>
        </template>
        <!--操作栏-->
        <template v-slot:action="{row}">
          <span v-if="handleType==='import'" class="link"
                @click="handleCheckImport(row.id)">
            查看
          </span>
          <span v-else class="link" :class="{'link-disable':row.jobStatus!=='COMPLETED'}"
                @click="handleDownloadExport(row.id)">
            下载
          </span>
        </template>
      </b-table>
    </v-table-layout>
    <b-modal v-model="detailDialog" title="导入详情" append-to-body width="940" :mask-closable="false">
      <div class="detail-wrap">
        <div class="detail" v-if="importDetail">
          <p class="status">
                    <span>导入状态：
                      <b-tag :type="statusStyleMap[importDetail.jobStatus]" size="small"
                             :tag-style="{borderRadius: '30px'}">
                        {{ statusMap[importDetail.jobStatus] }}
                      </b-tag>
                    </span>
          </p>
          <p flex="box:mean">
            <span>导入用户：<span>{{ importDetail.createName }}</span></span>
            <span>导入时间：<span>{{ importDetail.uploadDate }}</span></span>
            <span>导入组织：<span>{{ importDetail.createDeptName }}</span></span>
          </p>
          <p flex="box:mean">
            <span>原文件名：<span>{{ importDetail.fileName }}</span></span>
            <span>文件大小：<span>{{ importDetail.fileLength }}</span></span>
            <span>数据总量：<span>{{ importDetail.totalCount }}</span></span>
          </p>
          <p flex="box:mean">
            <span>
              <span>错误数据量：<span>{{ importDetail.validationCount }}</span></span>&nbsp;
              <span class="link" v-if="importDetail.validationCount>0"
                    @click="handleDownloadImportFile(importDetail.batchInfoId,'error')">下载：错误数据</span>
            </span>
            <span>成功数据量：<span>{{ importDetail.cachedCount }}</span></span>
            <span></span>
          </p>
        </div>
        <template v-if="errDataColumns.length>0">
          <b-divider></b-divider>
          <v-title-bar tip-pos="left" label="导入错误数据信息" no-border></v-title-bar>
          <b-table slot="table" :columns="errDataColumns" :data="errDataRows" size="small"
                   stripe ref="table" width="900">
          </b-table>
        </template>
      </div>
      <div slot="footer" class="t-center">
        <b-button size="small" @click="detailDialog=false">关闭</b-button>
      </div>
    </b-modal>
    <!--下方分页器-->
    <b-page slot="footer" :total="total" show-sizer
            @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
  </b-modal>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import * as api from '../../../../../api/dir/gather.api'
  import { downloadExport, queryErrorExcelInfo, queryImportDetails } from '../../../../../api/import-export.api'
  import Util from '../../../../../common/utils/util'

  export default {
    name: 'ImportExportList',
    mixins: [commonMixin, permission],
    data() {
      return {
        drawerVisible: false,
        detailDialog: false,
        listQuery: {
          jobType: '', // 任务类型
          beginTime: '', // 开始时间
          endTime: '', // 结束时间
          status: ''
        },
        statusMap: { COMPLETED: '已完成', STARTED: '正在进行中', FAILED: '失败' },
        statusStyleMap: { COMPLETED: 'primary', STARTED: 'warning', FAILED: 'danger' },
        handleType: 'import', // 操作类型，['import','export']
        importDetail: null, // 文件导入信息详情
        errDataColumns: [],
        errDataRows: [] // 导入错误数据信息
      }
    },
    computed: {
      columns() {
        if (this.handleType === 'import') {
          return [
            {
              title: '序号',
              type: 'index',
              width: 70,
              align: 'center',
              indexMethod: (row) => {
                return this.listQuery.size * (this.listQuery.page - 1) + row._index + 1
              }
            },
            { title: '文件名', key: 'fileName' },
            { title: '导入时间', key: 'uploadDate' },
            { title: '导入组织', key: 'createDeptName' },
            { title: '导入状态', slot: 'jobStatus', width: 100, align: 'center' },
            { title: '操作', slot: 'action', width: 100, align: 'center' }
          ]
        }
        return [
          {
            title: '序号',
            type: 'index',
            width: 70,
            align: 'center',
            indexMethod: (row) => {
              return this.listQuery.size * (this.listQuery.page - 1) + row._index + 1
            }
          },
          { title: '任务名称', key: 'jobName' },
          { title: '创建时间', key: 'createDate' },
          { title: '导出组织', key: 'createDeptName' },
          { title: '导出状态', slot: 'jobStatus', width: 100, align: 'center' },
          { title: '数据总量', key: 'totalCount', width: 100, align: 'center' },
          { title: '任务下载', slot: 'action', width: 100, align: 'center' }
        ]
      },
      jobType() {
        return `${this.handleType.toUpperCase()}`
      }
    },
    methods: {
      open(resource) {
        this.resourceKey = resource.resourceKey
        this.resourceName = resource.resourceName
        this.resetQuery()
        // 查询成功时打开
        this.drawerVisible = true
      },
      // 操作类型改变事件
      typeChange() {
        this.listQuery.jobType = this.jobType
        this.handleFilter()
      },
      // 日期改变事件
      dateChange(date) {
        // 给开始和结束时间设置值
        this.listQuery.beginTime = date[0]
        this.listQuery.endTime = date[1]
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.handleType = 'import'
        this.listQuery = {
          page: 1,
          size: 10,
          jobType: this.jobType,
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
        let search = this.handleType === 'import' ? api.queryImportRecords : api.queryExportRecords
        search(this.listQuery, this.resourceKey).then(response => {
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
        this.importDetail = null // 清空数据
        this.errDataColumns = []
        this.errDataRows = []
        api.queryImportDetails(id).then(res => {
          if (res.data.code === '0') {
            this.importDetail = res.data.data
            this.detailDialog = true
            // 如果存在错误数据下载则再请求读取错误列表
            if (this.importDetail.validationCount && this.importDetail.validationCount > 0) {
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
            this.$message({ type: 'danger', content: res.data.message })
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
      // 下载导入文件 type={error或repeat}
      handleDownloadImportFile(id, type) {
        if (!this.downloadImportEvent) {
          this.downloadImportEvent = this.$util.debounce((id) => {
            api.downloadImport(id, type).then(res => {
              if (res.status === 200) {
                Util.downloadFile(res.data, `${this.resourceName}-${type}.xlsx`)
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
