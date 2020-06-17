<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
                @on-select-change="handTreeCurrentChange"></b-tree>
        <!--任务概览-->
        <div class="task-pane" flex="box:mean">
          <div class="block b1" flex>
            <div class="icon">
              <img src="../../../assets/images/case.svg" alt="" @click="filterByGroupType()">
            </div>
            <div>
              <p class="title">{{ `${analysisMap.type==='all'?'方案':'任务'}总数量` }}</p>
              <p class="counts"><a @click="filterByGroupType()">{{
                analysisMap[analysisMap.type==='all'?'totalPlanNum':'totalTasksNum']}}</a></p>
            </div>
          </div>
          <div class="block b2" flex>
            <div class="icon">
              <img src="../../../assets/images/success.svg" alt="" @click="filterByGroupType('COMPLETED')">
            </div>
            <div>
              <p class="title">{{ `${analysisMap.type==='all'?'方案':'任务'}成功数量` }}</p>
              <p class="counts"><a @click="filterByGroupType('COMPLETED')">{{
                analysisMap[analysisMap.type==='all'?'successPlanNum':'successTasksNum']}}</a></p>
            </div>
          </div>
          <div class="block b3" flex>
            <div class="icon">
              <img src="../../../assets/images/failed.svg" alt="" @click="filterByGroupType('FAILED')">
            </div>
            <div>
              <p class="title">{{ `${analysisMap.type==='all'?'方案':'任务'}失败数量` }}</p>
              <p class="counts"><a @click="filterByGroupType('FAILED')">{{
                analysisMap[analysisMap.type==='all'?'failedPlanNum':'failedTasksNum']}}</a></p>
            </div>
          </div>
        </div>
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="任务名称">
            <b-input v-model="listQuery.taskName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="运行状态">
            <b-select v-model="listQuery.jobStatus" clearable placeholder="全部">
              <b-option v-for="(value,key) in lastJobStatusMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--交换类型-->
          <template v-slot:exchangeType="{row}">{{ exchangeTypeMap[row.exchangeType] }}</template>
          <!--执行状态-->
          <template v-slot:lastRunResult="{row}">
            <b-tag v-if="row.lastRunResult" :type="statusStyleMap[row.lastRunResult]" dot no-border
                   :tag-style="{backgroundColor: 'transparent',color:'rgba(0,0,0,.65)',fontSize:'14px'}">
              {{ lastJobStatusMap[row.lastRunResult] }}
            </b-tag>
          </template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <b-tooltip content="任务执行记录" theme="light" max-width="200" style="padding-top: 3px;">
              <b-button type="text" icon="ios-list-box" :disabled="!havePermission('recordList')"
                        :icon-style="{fontSize:'20px'}" @click="handleCheck(row)"/>
            </b-tooltip>&nbsp;
            <b-tooltip content="任务启动" theme="light" max-width="200" style="padding-top: 3px;">
              <b-button text-color="success" type="text" icon="ios-play-circle" :disabled="!havePermission('startTask')"
                        :icon-style="{fontSize:'20px'}" @click="handleStartTask(row.id)"/>
            </b-tooltip>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="total" show-sizer :current.sync="listQuery.page"
                @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle" show-close @on-close="handleCancel">
      <v-table-wrap>
        <b-alert>
          <b-row>
            <b-col span="6">
              <v-simple-label label="交换方案" style="padding:0;">{{planName}}</v-simple-label>
            </b-col>
            <b-col span="6">
              <v-simple-label label="定时周期" style="padding:0;">{{cronStr}}</v-simple-label>
            </b-col>
            <b-col span="6">
              <v-simple-label label="状态" style="padding:0;">{{availableStatusMap[availableStatus]}}
              </v-simple-label>
            </b-col>
            <!--<b-col span="6">
              <v-simple-label label="执行次数" style="padding:0;">{{totalCount}}</v-simple-label>
            </b-col>-->
          </b-row>
        </b-alert>
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="起始日期">
            <b-date-picker type="daterange" @on-change="dateChange" placement="bottom-start"
                           placeholder="选择日期范围" append-to-body></b-date-picker>
          </v-filter-item>
          <v-filter-item title="执行状态">
            <b-select v-model="dirBatchQuery.jobStatus" clearable placeholder="全部">
              <b-option v-for="(value,key) in jobStatusMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilterBatch" @on-reset="resetFilterBatchQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="dirBatchColumns" :data="dirBatchList" :loading="dirBatchLoading">
          <!--任务状态-->
          <template v-slot:jobStatus="{row}">
            <b-tag :type="statusStyleMap[row.jobStatus]" dot no-border
                   :tag-style="{backgroundColor: 'transparent',color:'rgba(0,0,0,.65)',fontSize:'14px'}">
              {{ jobStatusMap[row.jobStatus] }}
            </b-tag>
          </template>
          <template #action="{row}">
            <b-tooltip content="记录明细" theme="light" max-width="200" style="padding-top: 3px;">
              <b-button type="text" icon="ios-filing" :disabled="!havePermission('taskDetail')"
                        :icon-style="{fontSize:'20px'}" @click="handleCheckDetail(row.id)"/>
            </b-tooltip>&nbsp;
            <b-tooltip content="清理" theme="light" max-width="200" style="padding-top: 3px;">
              <b-button type="text" icon="ios-close-circle" text-color="warning"
                        :disabled="!havePermission('clearJob')"
                        :icon-style="{fontSize:'20px'}" @click="handleClearJob(row.id)"/>
            </b-tooltip>&nbsp;
            <b-tooltip content="重启" theme="light" max-width="200" style="padding-top: 3px;">
              <b-button type="text" icon="ios-refresh-circle" text-color="danger"
                        :disabled="!havePermission('restartJob')"
                        :icon-style="{fontSize:'20px'}" @click="handleRestartJob(row.id)"/>
            </b-tooltip>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="dirBatchTotal" :current.sync="dirBatchQuery.page" @on-change="handleDirPageChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <b-modal v-model="detailDialog" title="执行记录详细" width="940" :mask-closable="false">
      <template v-if="batchDetail">
        <div class="status">
          <v-simple-label label="任务状态">
            <b-tag :type="statusStyleMap[batchDetail.jobStatus]"
                   :tag-style="{borderRadius: '30px'}">
              {{ jobStatusMap[batchDetail.jobStatus] }}
            </b-tag>
          </v-simple-label>
        </div>
        <div flex="box:mean">
          <v-simple-label label="交换方案">{{ batchDetail.cfgName }}</v-simple-label>
          <v-simple-label label="任务名称">{{ batchDetail.resourceName }}</v-simple-label>
          <v-simple-label label="定时周期">{{ batchDetail.cronStr }}</v-simple-label>
        </div>
        <div flex="box:mean">
          <v-simple-label label="起始日期">{{ batchDetail.createDate }}</v-simple-label>
          <v-simple-label label="结束日期">{{ batchDetail.finishDate }}</v-simple-label>
          <v-simple-label label="总耗时">{{ batchDetail.duration }}</v-simple-label>
        </div>
        <div flex="box:mean">
          <v-simple-label label="交换数据总量">{{ batchDetail.totalCount }}</v-simple-label>
          <v-simple-label label="入库有效数量">{{ batchDetail.validCount}}</v-simple-label>
          <v-simple-label label="验证无效数量">{{ batchDetail.errorCount }}</v-simple-label>
          <v-simple-label label="验证重复数量">{{ batchDetail.repeatCount }}</v-simple-label>
        </div>
        <div flex="box:mean">
          <v-simple-label label="错误报告" v-if="batchDetail.errorCount!==0">
            <span class="link" @click="handleDownloadError(batchDetail.id)">下载</span>
          </v-simple-label>
          <v-simple-label label="重复报告" v-if="batchDetail.repeatCount!==0">
            <span class="link" @click="handleDownloadRepeat(batchDetail.id)">下载</span>
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
  import * as api from '../../../api/data-manage/excange-monitor.api'
  import Util from '../../../common/utils/util'

  export default {
    name: 'ExchangeMonitor',
    mixins: [commonMixin, permission],
    data() {
      return {
        treeData: [],
        listQuery: {
          planId: '',
          taskName: '',
          jobStatus: ''
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '任务名称', key: 'resourceName' },
          { title: '交换类型', slot: 'exchangeType', align: 'center', width: 90 },
          { title: '运行周期', key: 'cronStr' },
          { title: '执行次数', key: 'totalCount', align: 'center', width: 90 },
          { title: '执行时间(最近)', key: 'lastRunTime', width: 200 },
          { title: '运行状态(最近)', slot: 'lastRunResult', align: 'center', width: 150 },
          { title: '操作', slot: 'action', width: 120 }
        ],
        availableStatusMap: { available: '有效', notavailable: '无效' }, // 有效状态
        lastJobStatusMap: { COMPLETED: '成功', FAILED: '失败', RUNNING: '运行中' },
        jobStatusMap: { COMPLETED: '完成', FAILED: '失败', STARTED: '运行中', REPEATING: '重复校验' }, //  任务状态
        statusStyleMap: {
          COMPLETED: 'success',
          STARTED: 'primary',
          FAILED: 'danger',
          REPEATING: 'warning',
          RUNNING: 'warning'
        },
        exchangeTypeMap: { MANUAL: '人工交换', AUTO: '自动交换' },
        flowDirectionMap: { collect: '归集', submit: '上报', share: '共享' },
        analysisMap: {
          type: 'all', // type: "single"
          totalPlanNum: 1, // totalTasksNum
          successPlanNum: 0, // successTasksNum
          failedPlanNum: 1 // failedTasksNum runningTasksNum
        },
        dirBatchQuery: {
          size: 10,
          page: 1,
          taskId: '',
          dateRange: ['', ''],
          jobStatus: ''
        },
        dirBatchTotal: 0, // 当前页面显示的总数据,
        dirBatchList: [], // 当前页面显示的数据列表
        dirBatchColumns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '起始时间', key: 'createDate' },
          { title: '结束时间', key: 'finishDate' },
          { title: '耗时', key: 'duration', width: 100 },
          { title: '任务状态', slot: 'jobStatus', width: 100, align: 'center' },
          { title: '数据总量', key: 'totalCount', width: 100, align: 'center' },
          { title: '失败数量', key: 'errorCount', width: 100, align: 'center' },
          { title: '重复数量', key: 'repeatCount', width: 100, align: 'center' },
          { title: '操作', slot: 'action', width: 130 }
        ],
        dirBatchLoading: false,
        detailDialog: false,
        batchDetail: null,
        resourceName: '',
        planName: '', // 方案名称
        cronStr: '', // 定时周期
        availableStatus: '', // 有效状态
        totalCount: '' // 执行次数
      }
    },
    created() {
      this.initTree()
    },
    computed: {
      editTitle() {
        return '[' + this.resourceName + ']任务执行记录'
      }
    },
    methods: {
      /* [事件响应] */
      handTreeCurrentChange(data, node) {
        if (this.currentTreeNode.id === node.id) {
          node.selected = true
        }
        this.currentTreeNode = node
        this.listQuery.planId = node.id
        this.handleFilter()
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          page: 1,
          size: 10,
          planId: '',
          taskName: '',
          availableStatus: 'available'
        }
        this.handleFilter()
      },
      // 查看执行记录列表
      handleCheck(row) {
        this.dirBatchQuery = {
          size: 10,
          page: 1,
          taskId: row.id,
          dateRange: [],
          jobStatus: ''
        }
        this.resourceName = row.resourceName
        this.planName = row.planName
        this.cronStr = row.cronStr
        this.availableStatus = row.availableStatus
        this.totalCount = row.totalCount
        this.getDirBatchList()
      },
      // 查看执行记录详情
      handleCheckDetail(id) {
        api.queryDirBatchInfo(id).then(res => {
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
      // tree:初始化树结构
      initTree() {
        this.treeData = []
        // 请求响应返回树结构
        api.getExchangePlanTree().then(response => {
          const tree = response.data.data
          // 根据返回的数组格式化为树结构的格式，并追加parents用于级联选择和展开
          let data = tree ? this.treeMapper(tree, null, ['code']) : {}
          this.treeData.push(data)
          if (this.treeData.length > 0) {
            if (!this.currentTreeNode) {
              this.currentTreeNode = this.treeData[0]
              this.$set(this.treeData[0], 'selected', true)
              this.$set(this.treeData[0], 'expand', true)
            }
            this.listQuery.planId = this.currentTreeNode.id
            this.handleFilter()
          }
        })
      },
      // 查询所有列表
      searchList() {
        this.setListData()
        api.getExchangeList(this.listQuery).then(response => {
          if (response.status === 200) {
            this.setListData({
              list: response.data.rows,
              total: response.data.total
            })
          }
        })
        this.searchAnalysis()
      },
      // 查询方案概览
      searchAnalysis() {
        api.getExchangeAnalysis(this.currentTreeNode.code, this.currentTreeNode.id)
          .then(res => {
            if (res.data.code === '0') {
              this.analysisMap = res.data.data
            }
          })
      },
      // 查询执行记录列表
      handleFilterBatch() {
        this.dirBatchQuery.page = 1
        this.getDirBatchList()
      },
      // 清空任务查询参数
      resetFilterBatchQuery() {
        this.dirBatchQuery = {
          size: 10,
          page: 1,
          taskId: '',
          dateRange: ['', ''],
          jobStatus: ''
        }
      },
      // 查询执行记录列表
      getDirBatchList() {
        this.dirBatchList = []
        this.dirBatchLoading = true
        api.getJobsByTask(this.dirBatchQuery).then(res => {
          if (res.status === 200) {
            this.dirBatchTotal = res.data.total
            this.dirBatchList = res.data.rows
            this.openEditPage('check')
          }
          this.dirBatchLoading = false
        })
      },
      // 下载验证错误文件
      handleDownloadError(id) {
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
      },
      // 下载数据重复文件
      handleDownloadRepeat(id) {
        let fileName = '重复记录.xlsx'
        if (!this.downloadEvent) { // 点击下载事件，需要函数防抖动
          this.downloadEvent = this.$util.debounce((id) => {
            api.downloadRepeat(id).then(res => {
              if (res.status === 200) {
                Util.downloadFile(res.data, fileName)
              }
            })
          }, 1000)
        }
        this.downloadEvent(id)
      },
      // 执行手动任务启动
      handleStartTask(id) {
        this.$confirm({
          title: '确定启动务任？',
          content: '启动后不可恢复。',
          loading: true,
          onOk: () => {
            api.startTask(id).then(res => {
              if (res.data.code === '0') {
                this.$notice.success({ title: '务任启动成功' })
                this.handleFilter()
              } else {
                this.$notice.danger({ title: '任务启动失败', desc: res.data.message || '' })
              }
              this.$modal.remove()
            })
          }
        })
      },
      // 作业清理
      handleClearJob(id) {
        this.$confirm({
          title: '确定清理作业？',
          content: '清理后不可恢复',
          loading: true,
          okType: 'warning',
          onOk: () => {
            api.clearJob(id).then(res => {
              if (res.data.code === '0') {
                this.$notice.success({ title: '作业清理成功' })
                this.handleFilterBatch()
              } else {
                this.$notice.danger({ title: '作业清理失败', desc: res.data.message || '' })
              }
              this.$modal.remove()
            })
          }
        })
      },
      // 作业重启
      handleRestartJob(id) {
        this.$confirm({
          title: '确定重启此执行记录？',
          loading: true,
          okType: 'danger',
          onOk: () => {
            api.restartJob(id).then(res => {
              if (res.data.code === '0') {
                this.$notice.success({ title: '作业重启成功' })
                this.handleFilterBatch()
              } else {
                this.$notice.danger({ title: '作业重启失败', desc: res.data.message || '' })
              }
              this.$modal.remove()
            })
          }
        })
      },
      filterByGroupType(type) {
        if (typeof type === 'undefined') {
          this.listQuery.jobStatus = null
        } else {
          this.listQuery.jobStatus = type
        }
        this.handleFilter()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .task-pane {
    margin-bottom: 16px;
    padding: 20px;
    background: #fafafa;
    .block {
      padding: 0 24px;
      &.b1 {
        border-right: 2px solid #eee;
      }
      &.b2 {
        border-right: 2px solid #eee;
      }
      .icon {
        padding: 2px 30px 2px 20px;
        img {
          width: 50px;
          cursor: pointer;
        }
      }
      .counts {
        font-size: 24px;
        padding-top: 10px;
        a {
          color: rgba(0, 0, 0, .65);
        }
      }
    }
  }
</style>
