<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <v-filter-bar>
          <v-filter-item title="资源名称">
            <b-input v-model="listQuery.resourceName" size="small" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="方案名称">
            <b-input v-model="listQuery.cfgName" size="small" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="状态">
            <b-select v-model="listQuery.availableStatus" size="small" clearable placeholder="全部">
              <b-option v-for="(value,key) in availableStatusMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--有效状态-->
          <template v-slot:availableStatus="scope">
            <span v-if="scope.row.availableStatus==='available'" style="color:#48c9b0;">有效</span>
            <span v-else style="color:#e91e63;">无效</span>
          </template>
          <!--操作栏-->
          <template v-slot:action="scope">
            <b-button type="text" @click="handleCheck(scope.row)">查看</b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-table-wrap>
        <v-filter-bar>
          <v-filter-item title="日期">
            <b-date-picker style="width: 200px;" type="daterange" @on-change="dateChange" placement="bottom-start"
                           size="small" placeholder="选择起止日期" append-to-body></b-date-picker>
          </v-filter-item>
          <v-filter-item title="状态">
            <b-select v-model="dirBatchQuery.jobStatus" clearable placeholder="全部" size="small">
              <b-option v-for="(value,key) in jobStatusMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <v-filter-item title="状态">
            <b-select v-model="listQuery.availableStatus" size="small" clearable placeholder="全部">
              <b-option v-for="(value,key) in availableStatusMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilterBatch" @on-reset="resetFilterBatchQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="dirBatchColumns" :data="dirBatchList" :loading="dirBatchLoading">
          <!--任务状态-->
          <template v-slot:jobStatus="{row}">
            <b-tag v-if="row.jobStatus" :type="statusStyleMap[row.jobStatus]" size="small">
              {{ jobStatusMap[row.jobStatus] }}
            </b-tag>
          </template>
          <template #action="{row}">
            <b-button type="text" @click="handleCheckDetail(row)">查看</b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="dirBatchTotal" @on-change="handleDirPageChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <b-modal v-model="detailDialog" title="任务执行详情" width="940" :mask-closable="false">
      <template v-if="batchDetail">
        <div class="status">
          <v-simple-label label="任务状态">
            <b-tag :type="jobStatusMap[batchDetail.jobStatus]" size="small"
                   :tag-style="{borderRadius: '30px'}">
              {{ jobStatusMap[batchDetail.jobStatus] }}
            </b-tag>
          </v-simple-label>
        </div>
        <div flex="box:mean">
          <v-simple-label label="资源名称">{{ batchDetail.resourceName }}</v-simple-label>
          <v-simple-label label="资源标志">{{ batchDetail.metadataKey }}</v-simple-label>
          <v-simple-label label="交换方案">{{ batchDetail.cfgName }}</v-simple-label>
        </div>
        <div flex="box:mean">
          <v-simple-label label="原信息标识">{{ batchDetail.metadataKey }}</v-simple-label>
          <v-simple-label label="定时周期">{{ batchDetail.cronStr }}</v-simple-label>
          <v-simple-label label="数据总量">{{ batchDetail.totalCount }}</v-simple-label>
        </div>
        <div flex="box:mean">
          <v-simple-label label="起始时间">{{ batchDetail.createDate }}</v-simple-label>
          <v-simple-label label="结束时间">{{ batchDetail.finishDate }}</v-simple-label>
          <v-simple-label label="总耗时">{{ batchDetail.duration }}</v-simple-label>
        </div>
        <div flex="box:mean">
          <v-simple-label label="正式数据量">{{ batchDetail.totalCount }}</v-simple-label>
          <v-simple-label label="错误数量">{{ batchDetail.errorCount }}</v-simple-label>
          <v-simple-label label="重复数量">{{ batchDetail.repeatCount }}</v-simple-label>
        </div>
        <div flex="box:mean">
          <v-simple-label label="错误报告" v-if="batchDetail.errorCount!=='0'">
            <span class="link" @click="handleDownloadExport(batchDetail.id)">下载文件</span>
          </v-simple-label>
          <v-simple-label label="重复报告" v-if="batchDetail.repeatCount!=='0'">
            <span class="link" @click="handleDownloadExport(batchDetail.id)">下载文件</span>
          </v-simple-label>
        </div>
      </template>
      <div slot="footer">
        <b-button @click="detailDialog=false">关闭</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/dir/auto-collection.api'
  import Util from '../../../common/utils/util'

  export default {
    name: 'TaskTrace',
    mixins: [commonMixin, permission],
    data() {
      return {
        moduleName: '执行记录',
        listQuery: {
          resourceName: '',
          cfgName: '',
          availableStatus: 'available'
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '资源名称', key: 'resourceName' },
          { title: '交换方案', key: 'cfgName' },
          { title: '运行周期', key: 'cronStr' },
          { title: '最后执行时间', key: 'lastExecutionTime', width: 200 },
          { title: '执行次数', key: 'executionNum', align: 'center', width: 100 },
          { title: '有效状态', slot: 'availableStatus', align: 'center', width: 100 },
          { title: '操作', slot: 'action', align: 'center', width: 90 }
        ],
        availableStatusMap: { available: '有效', notavailable: '无效' }, // 有效状态
        jobStatusMap: { STARTING: '正在运行', COMPLETED: '已完成', FAILED: '失败' }, //  任务状态
        statusStyleMap: { COMPLETED: 'primary', STARTED: 'warning', FAILED: 'danger' },
        dirBatchQuery: {
          size: 10,
          page: 1,
          resourceKey: '',
          cfgDetailId: '',
          dateRange: ['', ''],
          jobStatus: ''
        },
        dirBatchTotal: 0, // 当前页面显示的总数据,
        dirBatchList: [], // 当前页面显示的数据列表
        dirBatchColumns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '起始时间', key: 'createDate', width: 200 },
          { title: '结束时间', key: 'finishDate', width: 200 },
          { title: '总耗时', key: 'duration' },
          { title: '任务状态', slot: 'jobStatus' },
          { title: '数据总数', key: 'totalCount' },
          { title: '失败条数', key: 'errorCount' },
          { title: '重复条数', key: 'repeatCount' },
          { title: '操作', slot: 'action', width: 75 }
        ],
        dirBatchLoading: false,
        detailDialog: false,
        batchDetail: null
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
          resourceName: '',
          cfgName: '',
          availableStatus: 'available'
        }
        this.handleFilter()
      },
      // 查看执行记录列表
      handleCheck(row) {
        this.dirBatchQuery = {
          size: 10,
          page: 1,
          resourceKey: row.resourceKey,
          cfgDetailId: row.id,
          dateRange: [],
          jobStatus: ''
        }
        this.getDirBatchList()
      },
      // 查看执行记录详情
      handleCheckDetail(row) {
        let { id, cfgDetailId } = row
        api.queryDirBatchInfo(id, cfgDetailId).then(res => {
          if (res.data.code === '0') {
            this.batchDetail = res.data.data
            this.detailDialog = true
          }
        })
      },
      // 日期范围改变
      dateChange(val) {
        this.dirBatchQuery.dateRange = val
      },
      // 执行记录列表分页事件
      handleDirPageChange(page) {
        this.dirBatchQuery.page = page
        this.getDirBatchList()
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getAutoCollectList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
      },
      // 查询执行记录列表
      handleFilterBatch() {
        this.dirBatchQuery.page = 1
        this.getDirBatchList()
      },
      resetFilterBatchQuery() {
        this.dirBatchQuery = {
          size: 10,
          page: 1,
          resourceKey: '',
          cfgDetailId: '',
          dateRange: ['', ''],
          jobStatus: ''
        }
      },
      // 查询执行记录列表
      getDirBatchList() {
        this.dirBatchList = []
        this.dirBatchLoading = true
        api.getDirBatchList(this.dirBatchQuery).then(res => {
          if (res.status === 200) {
            this.dirBatchTotal = res.data.total
            this.dirBatchList = res.data.rows
            this.openEditPage('check')
          }
          this.dirBatchLoading = false
        })
      },
      // 下载错误文件
      handleDownloadExport(id) {
        let fileName = '错误记录.xlsx'
        if (!this.downloadEvent) { // 点击下载事件，需要函数防抖动
          this.downloadEvent = this.$util.debounce((id) => {
            api.downloadError(id).then(res => {
              if (res.status === 200) {
                Util.downloadFile(res.data, fileName)
              }
            })
          }, 1000)
        }
        this.downloadEvent(id)
      }
    }
  }
</script>
