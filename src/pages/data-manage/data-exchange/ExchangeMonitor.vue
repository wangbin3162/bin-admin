<template>
  <div>
    <page-header-wrap v-show="isNormal">
      <v-table-wrap>
        <!--树结构-->
        <b-tree :data="treeData" slot="tree" :lock-select="lockTreeSelect"
                @on-select-change="handTreeCurrentChange"></b-tree>
        <!--任务概览-->
        <div class="task-pane">
          <div v-if="analysisMap.type==='all'">
            <b-row :gutter="20">
              <b-col span="8">
                <div class="block b1" flex>
                  <div class="icon">
                    <b-icon name="ios-today" size="30"/>
                  </div>
                  <div>
                    <p class="title">方案数量</p>
                    <p class="counts">{{analysisMap.totalPlanNum}}</p>
                  </div>
                </div>
              </b-col>
              <b-col span="8">
                <div class="block b2" flex>
                  <div class="icon">
                    <b-icon name="ios-checkbox-outline" size="30"/>
                  </div>
                  <div>
                    <p class="title">任务成功数量</p>
                    <p class="counts">{{analysisMap.successPlanNum}}</p>
                  </div>
                </div>
              </b-col>
              <b-col span="8">
                <div class="block b3" flex>
                  <div class="icon">
                    <b-icon name="ios-close-circle-outline" size="30"/>
                  </div>
                  <div>
                    <p class="title">任务失败数量</p>
                    <p class="counts">{{analysisMap.failedPlanNum}}</p>
                  </div>
                </div>
              </b-col>
            </b-row>
          </div>
          <div v-else>
            <b-row :gutter="20">
              <b-col span="6">
                <div class="block b1" flex>
                  <div class="icon">
                    <b-icon name="ios-today" size="30"/>
                  </div>
                  <div>
                    <p class="title">方案数量</p>
                    <p class="counts">{{analysisMap.totalTasksNum}}</p>
                  </div>
                </div>
              </b-col>
              <b-col span="6">
                <div class="block b2" flex>
                  <div class="icon">
                    <b-icon name="ios-checkbox-outline" size="30"/>
                  </div>
                  <div>
                    <p class="title">任务成功数量</p>
                    <p class="counts">{{analysisMap.successTasksNum}}</p>
                  </div>
                </div>
              </b-col>
              <b-col span="6">
                <div class="block b3" flex>
                  <div class="icon">
                    <b-icon name="ios-close-circle-outline" size="30"/>
                  </div>
                  <div>
                    <p class="title">任务失败数量</p>
                    <p class="counts">{{analysisMap.failedTasksNum}}</p>
                  </div>
                </div>
              </b-col>
              <b-col span="6">
                <div class="block b4" flex>
                  <div class="icon">
                    <b-icon name="ios-log-out" size="30"/>
                  </div>
                  <div>
                    <p class="title">运行任务数量</p>
                    <p class="counts">{{analysisMap.runningTasksNum}}</p>
                  </div>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
        <v-filter-bar>
          <v-filter-item title="任务名称">
            <b-input v-model="listQuery.taskName" placeholder="请输入" clearable></b-input>
          </v-filter-item>
          <v-filter-item title="状态">
            <b-select v-model="listQuery.availableStatus" clearable placeholder="全部">
              <b-option v-for="(value,key) in availableStatusMap" :key="key" :value="key">{{ value }}</b-option>
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
            <b-tag :type="statusStyleMap[row.lastRunResult]" dot no-border
                   :tag-style="{backgroundColor: 'transparent',color:'rgba(0,0,0,.65)',fontSize:'14px'}">
              {{ jobStatusMap[row.lastRunResult] }}
            </b-tag>
          </template>
          <!--有效状态-->
          <template v-slot:availableStatus="{row}">
            <span v-if="row.availableStatus==='available'" :style="colorSuccess">有效</span>
            <span v-else :style="colorDanger">无效</span>
          </template>
          <!--操作栏-->
          <template v-slot:action="{row}">
            <b-button type="text" @click="handleCheck(row)">查看</b-button>
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
            <b-col span="6">
              <v-simple-label label="执行次数" style="padding:0;">{{totalCount}}</v-simple-label>
            </b-col>
          </b-row>
        </b-alert>
        <v-filter-bar>
          <v-filter-item title="日期">
            <b-date-picker type="daterange" @on-change="dateChange" placement="bottom-start"
                           placeholder="选择起止日期" append-to-body></b-date-picker>
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
            <b-button type="text" @click="handleCheckDetail(row)">查看</b-button>
          </template>
        </b-table>
        <!--下方分页器-->
        <b-page :total="dirBatchTotal" :current.sync="dirBatchQuery.page" @on-change="handleDirPageChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
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
          availableStatus: 'available'
        },
        columns: [
          { type: 'index', width: 50, align: 'center' },
          { title: '任务名称', key: 'resourceName' },
          { title: '交换类型', slot: 'exchangeType', align: 'center', width: 90 },
          { title: '运行周期', key: 'cronStr' },
          { title: '执行次数', key: 'totalCount', align: 'center', width: 90 },
          { title: '最近执行时间', key: 'lastRunTime', width: 200 },
          { title: '执行状态', slot: 'lastRunResult', align: 'center', width: 100 },
          { title: '有效状态', slot: 'availableStatus', align: 'center', width: 90 },
          { title: '操作', slot: 'action', align: 'center', width: 90 }
        ],
        availableStatusMap: { available: '有效', notavailable: '无效' }, // 有效状态
        jobStatusMap: { STARTING: '运行中', COMPLETED: '成功', FAILED: '失败' }, //  任务状态
        statusStyleMap: { COMPLETED: 'success', STARTED: 'primary', FAILED: 'danger' },
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
          { title: '数据总数', key: 'totalCount', width: 100, align: 'center' },
          { title: '失败条数', key: 'errorCount', width: 100, align: 'center' },
          { title: '重复条数', key: 'repeatCount', width: 100, align: 'center' },
          { title: '操作', slot: 'action', width: 75 }
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
        return '任务名称：' + this.resourceName
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

<style lang="stylus" scoped>
  .task-pane {
    margin-bottom: 16px;
    .block {
      background-color #0b87ed;
      padding: 16px 24px;
      border-radius: 15px;
      color: #fff;
      &.b1 {
        background-color #314BD8;
      }
      &.b2 {
        background-color #2D90FF;
      }
      &.b3 {
        background-color #23E1DF;
      }
      &.b4 {
        background-color #39cb4c;
      }
      .icon {
        padding: 2px 10px 0 0;
      }
      .counts {
        font-size: 24px;
        padding-top: 10px;
      }
    }
  }
</style>
