<template>
  <div>
    <page-header-wrap v-show="visible&&isNormal" :title="editTitle" show-close @on-close="handleClose">
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
          </b-row>
        </b-alert>
        <v-filter-bar @keyup-enter="handleFilter">
          <v-filter-item title="起始日期">
            <b-date-picker type="daterange" @on-change="dateChange" placement="bottom-start"
                           placeholder="选择日期范围"></b-date-picker>
          </v-filter-item>
          <v-filter-item title="执行状态">
            <b-select v-model="listQuery.jobStatus" clearable placeholder="全部">
              <b-option v-for="(value,key) in jobStatusMap" :key="key" :value="key">{{ value }}</b-option>
            </b-select>
          </v-filter-item>
          <!--添加查询按钮位置-->
          <v-filter-item @on-search="handleFilter" @on-reset="resetQuery"></v-filter-item>
        </v-filter-bar>
        <!--中央表格-->
        <b-table :columns="columns" :data="list" :loading="listLoading">
          <!--任务状态-->
          <template v-slot:jobStatus="{row}">
            <b-tag :type="ExchangeInstance.statusStyleMap[row.jobStatus]" dot no-border
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
        <b-page :total="total" :current.sync="listQuery.page" @on-change="handleCurrentChange"></b-page>
      </v-table-wrap>
    </page-header-wrap>
    <page-header-wrap v-show="isCheck" :title="editTitle+'详情'" show-close @on-close="handleCancel">
      <v-edit-wrap transparent v-if="batchDetail">
        <b-collapse-wrap title="任务详情">
          <div class="total-wrap">
            <div class="count-item">
              <span>交换数据总量</span><span>{{ batchDetail.totalCount }}</span>
            </div>
            <div class="count-item">
              <span>入库有效数量</span><span>{{ batchDetail.validCount }}</span>
            </div>
            <div class="count-item">
              <span>验证无效数量</span><span>{{ batchDetail.errorCount }}</span>
            </div>
            <div class="count-item">
              <span>验证重复数量</span><span>{{ batchDetail.repeatCount }}</span>
            </div>
          </div>
          <b-row>
            <b-col span="8">
              <v-simple-label label="任务状态">
                <b-tag :type="ExchangeInstance.statusStyleMap[batchDetail.jobStatus]"
                       :tag-style="{borderRadius: '30px'}">
                  {{ jobStatusMap[batchDetail.jobStatus] }}
                </b-tag>
              </v-simple-label>
            </b-col>
            <b-col span="8">
              <v-simple-label label="错误报告" v-if="batchDetail.errorCount!==0">
                <span class="link" @click="handleDownloadError(batchDetail.id)">下载</span>
              </v-simple-label>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="8">
              <v-simple-label label="交换方案">{{ batchDetail.cfgName }}</v-simple-label>
            </b-col>
            <b-col span="8">
              <v-simple-label label="任务名称">{{ batchDetail.resourceName }}</v-simple-label>
            </b-col>
            <b-col span="8">
              <v-simple-label label="定时周期">{{ batchDetail.cronStr }}</v-simple-label>
            </b-col>
          </b-row>
          <b-row>
            <b-col span="8">
              <v-simple-label label="起始日期">{{ batchDetail.createDate }}</v-simple-label>
            </b-col>
            <b-col span="8">
              <v-simple-label label="结束日期">{{ batchDetail.finishDate }}</v-simple-label>
            </b-col>
            <b-col span="8">
              <v-simple-label label="总耗时">{{ batchDetail.duration }}</v-simple-label>
            </b-col>
          </b-row>
          <v-simple-label label="错误信息" v-if="batchDetail.jobStatus ==='FAILED'">
            <b-input v-model="batchDetail.jobMessage" type="textarea" :rows="4" disabled></b-input>
          </v-simple-label>
        </b-collapse-wrap>
        <b-collapse-wrap title="同步详情" v-if="batchDetail.jobStatus ==='COMPLETED'">
          <b-row>
            <b-col span="8">
              <v-simple-label label="ES数据同步">
                <b-tag :type="ExchangeInstance.statusStyleMap[batchDetail.jobStatus]"
                       :tag-style="{borderRadius: '30px'}">
                  {{ jobStatusMap[batchDetail.esSyncStatus] }}
                </b-tag>
              </v-simple-label>
            </b-col>
            <b-col span="8">
              <v-simple-label label="开始日期">{{ batchDetail.finishDate}}</v-simple-label>
            </b-col>
            <b-col span="8">
              <v-simple-label label="同步数据总量">{{ batchDetail.esSyncCount}}</v-simple-label>
            </b-col>
          </b-row>
        </b-collapse-wrap>
        <b-button slot="footer" @click="handleCancel">返 回</b-button>
      </v-edit-wrap>
    </page-header-wrap>
  </div>
</template>

<script>
  import commonMixin from '../../../../../common/mixins/mixin'
  import permission from '../../../../../common/mixins/permission'
  import * as api from '../../../../../api/data-manage/excange-monitor.api'
  import Util from '../../../../../common/utils/util'
  import { deepCopy } from '../../../../../common/utils/assist'
  import { initFormList } from '../../../../../components/Validator/FieldsCfg/cfg-util'

  export default {
    name: 'ExchangeList',
    mixins: [commonMixin, permission],
    inject: ['ExchangeInstance'],
    props: {},
    data() {
      return {
        visible: false,
        listQuery: {
          taskId: '',
          dateRange: [],
          jobStatus: ''
        },
        columns: [
          { title: '作业ID', width: 100, key: 'jobId', align: 'center' },
          { title: '起始时间', key: 'createDate' },
          { title: '结束时间', key: 'finishDate' },
          { title: '总耗时', key: 'duration', align: 'center' },
          { title: '交换部门', key: 'cfgDeptName', align: 'center' },
          { title: '任务状态', slot: 'jobStatus', width: 100, align: 'center' },
          { title: '数据总量', key: 'totalCount', width: 90, align: 'center' },
          { title: '失败数量', key: 'errorCount', width: 90, align: 'center' },
          { title: '重复数量', key: 'repeatCount', width: 90, align: 'center' },
          { title: '操作', slot: 'action', width: 130 }
        ],
        availableStatusMap: { available: '有效', notavailable: '无效' }, // 有效状态
        jobStatusMap: { COMPLETED: '完成', FAILED: '失败', STARTED: '运行中' }, //  任务状态
        taskId: '',
        total: 0,
        resourceName: '',
        planName: '', // 方案名称
        cronStr: '', // 定时周期
        availableStatus: '', // 有效状态
        totalCount: '', // 执行次数,
        batchDetail: null //  批量任务执行记录详情
      }
    },
    computed: {
      editTitle() {
        return '[' + this.resourceName + ']任务执行记录'
      }
    },
    methods: {
      // ===========r任务执行记录面板打开============ //
      open(task) {
        this.taskId = task.id
        this.resourceName = task.resourceName
        this.planName = task.planName
        this.cronStr = task.cronStr
        this.availableStatus = task.availableStatus
        this.totalCount = task.totalCount
        // 查询列表
        this.resetQuery()
        this.visible = true
      },
      // ===========面板关闭============ //
      handleClose() {
        this.visible = false
        this.$emit('on-close')
      },
      // filter-Bar:重置查询条件
      resetQuery() {
        this.listQuery = {
          size: 10,
          page: 1,
          taskId: this.taskId,
          dateRange: ['', ''],
          jobStatus: ''
        }
        this.handleFilter()
      },
      // 日期范围改变
      dateChange(val) {
        this.listQuery.dateRange = val
      },
      // 查看执行记录详情
      handleCheckDetail(id) {
        api.queryDirBatchInfo(id).then(res => {
          if (res.data.code === '0') {
            this.batchDetail = res.data.data
            this.openEditPage('check')
          }
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
      // 查询执行记录列表
      searchList() {
        this.setListData()
        api.getJobsByTask(this.listQuery).then(res => {
          if (res.status === 200) {
            this.setListData({
              list: res.data.rows,
              total: res.data.total
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .total-wrap {
    display: flex;
    padding: 8px 0;
    background: #fafafa;
    margin-bottom: 16px;
    .count-item {
      display: flex;
      flex-direction: column;
      width: 25%;
      span {
        text-align: center;
        line-height: 32px;
        &:first-child {
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }
</style>
