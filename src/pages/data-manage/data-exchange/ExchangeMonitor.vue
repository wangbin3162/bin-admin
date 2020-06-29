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
    <exchange-list ref="exchangeList" @on-close="handleCancel"/>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/data-manage/excange-monitor.api'
  import ExchangeList from './components/ExchangeMonitor/ExchangeList'

  export default {
    name: 'ExchangeMonitor',
    components: { ExchangeList },
    mixins: [commonMixin, permission],
    provide() {
      return { ExchangeInstance: this }
    },
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
        lastJobStatusMap: { COMPLETED: '成功', FAILED: '失败', RUNNING: '运行中' },
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
        }
      }
    },
    created() {
      this.initTree()
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
        this.dialogStatus = 'exchangeList'
        this.$refs.exchangeList && this.$refs.exchangeList.open(row)
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
