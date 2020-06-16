<template>
  <div class="my-gather-data">
    <div class="header mb-20">
      <div class="msg-tips" flex="main:justify">
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>资源信息数量</i>
            <i class="count">{{counts.totalResource}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>数据归集总量</i>
            <i class="count">{{counts.totalCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>本月归集数据量</i>
            <i class="count">{{counts.monthCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>上月归集数据量</i>
            <i class="count">{{counts.preMonthCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>数据完整率</i>
            <i class="count">{{counts.completeRate}}%</i>
          </span>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="card-layout mb-20">
        <!--本月信息归集统计-->
        <div class="left">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
                  :body-style="{padding:0,height:'310px'}" shadow="never">
            <template v-slot:header>
              <div flex="main:justify cross:center">
                <span class="title-text">本月信息归集统计</span>
              </div>
            </template>
            <div flex="main:justify">
              <div class="summary" flex="dir:top">
                <span class="tip">N</span>
                <span>归集数据汇总</span>
                <span><i class="summary-count">{{counts.curCount}}</i>条</span>
                <span>本月已归集数据</span>
                <span>
                  <b-progress :percent="counts.percent" color="#fff" bgColor="#ffffff55"
                              :stroke-width="14"
                              :showText="false"></b-progress>
                </span>
                <span>再录{{counts.preCount - counts.curCount}}条就超过上月了哦，继续加油！</span>
                <router-link to="/dataManage/dataExchange/gather"
                             style="color:#fff;text-decoration: underline;padding-left: 30px;">去采集
                </router-link>
              </div>
              <div class="trend">
                <div class="chart-title">月度信息归集趋势</div>
                <div id="chart1" style="width: 100%;height: 100%;position: relative;">
                  <b-charts height="240px" theme="charts-theme" :options="lineChartOption"/>
                </div>
              </div>
            </div>
          </b-card>
        </div>
        <!--信息归集日历-->
        <div class="right">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
                  :body-style="{padding:0,height:'310px'}" shadow="never">
            <template v-slot:header>
              <div flex="main:justify cross:center">
                <span class="title-text">信息归集日历</span>
              </div>
            </template>
            <div flex="main:center">
              <b-calendar mini :body-style="{border:'none'}" style="padding: 0 0 15px;"
                          :day-style="{border:'none',borderRadius:'4px'}">
              </b-calendar>
            </div>
          </b-card>
        </div>
      </div>
      <div class="card-layout">
        <!-- 年度信息归集趋势-->
        <div class="left">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
                  :body-style="{padding:0,height:'310px'}" shadow="never">
            <template v-slot:header>
              <div flex="main:justify cross:center">
                <span class="title-text">年度信息归集趋势</span>

                <div flex="main:justify cross:baseline">
                  <b-select style="width: 150px; margin-right: 30px;"
                            size="mini" clearable filterable @on-change="handleResourceChange">
                    <b-option v-for="item in resources" :value="item.key" :key="item.key">
                      {{ item.text }}
                    </b-option>
                  </b-select>

                  <div class="tab-wrapper">
                    <div flex="">
                      <div class="tab" v-for="(year, index) in yearsText" :key="index"
                           @click="handleTabBtn(index)">
                        {{ year }}年
                      </div>
                    </div>
                    <div class="slide" :style="{ left: tab * 70 +'px'}"></div>
                  </div>
                </div>
              </div>
            </template>

            <div id="chart2" style="width: 100%;height: 100%;position: relative;">
              <b-charts height="280px" theme="charts-theme" :options="smoothLineChartOption"/>
            </div>
          </b-card>
        </div>
        <!--信息归集历史-->
        <div class="right">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
                  :body-style="{height:'310px'}" shadow="never">
            <template v-slot:header>
              <div flex="main:justify cross:center">
                <span class="title-text">信息归集历史</span>
              </div>
            </template>
            <b-table :columns="columns" :data="historyList" size="small"></b-table>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import commonMixin from '../../../common/mixins/mixin'
  import permission from '../../../common/mixins/permission'
  import * as api from '../../../api/data-analyze/data-analysis.api'
  import { formatDataSet } from 'bin-charts/src/utils/util'

  require('bin-charts/src/theme/charts-theme')
  export default {
    name: 'Analyze',
    mixins: [commonMixin, permission],
    data() {
      return {
        tab: 0,
        yearsText: [],
        resources: [],
        date: new Date(),
        listQuery: {
          departId: '',
          month: '2019-01',
          startDate: '',
          endDate: '',
          resourceKey: null
        },
        counts: {
          totalResource: '',
          totalCount: '',
          monthCount: '',
          preMonthCount: '',
          completeRate: 0.0,
          curCount: '',
          preCount: '',
          percent: 0.90
        },
        lineChartOption: {
          tooltip: { trigger: 'axis' },
          grid: {
            top: 20,
            bottom: 20
          },
          xAxis: { type: 'category', boundaryGap: false },
          yAxis: { type: 'value', axisLine: { show: false } },
          series: [{
            type: 'line',
            name: '数量',
            areaStyle: { opacity: 0.4 },
            itemStyle: { color: '#c7c7ff' },
            showSymbol: false
          }],
          dataset: formatDataSet(
            { xField: 'name', yField: 'value' },
            []
          )
        },
        smoothLineChartOption: {
          tooltip: { trigger: 'axis' },
          grid: {
            top: 20,
            bottom: 20
          },
          xAxis: { type: 'category', boundaryGap: false },
          yAxis: { type: 'value' },
          series: [{
            type: 'line',
            name: '数量',
            showSymbol: false,
            smooth: true,
            itemStyle: { color: '#1ed1b8' },
            areaStyle: { opacity: 0.4 }
          }],
          dataset: formatDataSet(
            { xField: 'name', yField: 'value' },
            []
          )
        },
        columns: [
          { title: '资源信息', key: 'resourceName', tooltip: true },
          { title: '归集数量', key: 'count', width: 88, align: 'center' },
          { title: '归集日期', key: 'date', width: 110 }
        ],
        historyList: [],
        resourceList: [],
        yearList: [],
        yearSelect: ''
      }
    },
    created() {
      this.init()
    },
    methods: {
      // 临时设置departId
      resetListQuery() {
        this.listQuery.departId = this.$store.state.user.info.departId
      },
      // 年度归集信息select回调
      handleResourceChange(val) {
        if (val) {
          this.listQuery.resourceKey = val
        } else {
          this.listQuery.resourceKey = null
        }
        this.getYearData(this.tab)
      },
      // 年度归集信息tab按钮回调
      handleTabBtn(curTab) {
        this.tab = curTab // curTab可用做计算之前的年份的偏移量
        this.getYearData(curTab)
      },
      // 查询所有列表
      searchList() {
        this.resetListQuery()
        // 2.4.1 资源信息数量
        api.getTotalResource(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.totalResource = res.data.data.cnt
          }
        })
        // 2.4.2 数据归集总量
        api.getTotalCount(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.totalCount = res.data.data.value
          }
        })
        // 2.4.3 本月归集数据量
        api.getCurMonthCount(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.monthCount = res.data.data.monthCount
          }
        })
        // 2.4.4 上月归集数据量
        api.getPreMonthCount(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.preMonthCount = res.data.data.preMonthCount
          }
        })
        // 2.4.5 数据完整率
        api.getCompleteRate(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.completeRate = res.data.data.completeRate.toFixed(1)
          }
        })
        // 2.4.6 本月信息归集统计
        api.getCurCompleteRate(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.curCount = res.data.data.curCount
            this.counts.preCount = res.data.data.preCount
          }
        })
        // 2.4.10 信息归集历史
        api.getDataHistory(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.historyList = res.data.data.rows
          }
        })
        // 2.4.7 月度信息归集趋势
        this.getMonthData()
        // 年度信息归集趋势
        this.getYearData()
      },
      // 2.4.7 月度信息归集趋势
      getMonthData() {
        // 取当前时间半年前
        const [startDate, endDate] = this.timeHandler(150)
        this.listQuery.startDate = startDate
        this.listQuery.endDate = endDate

        api.getMonthData(this.listQuery).then(res => {
          if (res.data.code === '0') {
            let data = res.data.data
            this.lineChartOption.dataset = formatDataSet({ xField: 'name', yField: 'value' }, data)
          }
        })
      },
      // 获取年度归集趋势
      getYearData(offset = 0) {
        // 如果是当前年则取当前时间一年前
        let [startDate, endDate] = this.timeHandler(360)
        if (offset > 0) { // 不是当前年则取之前年份的01-12
          startDate = (new Date().getFullYear() - offset) + '-01'
          endDate = (new Date().getFullYear() - offset) + '-12'
        }
        this.listQuery.startDate = startDate
        this.listQuery.endDate = endDate

        api.getYearData(this.listQuery).then(res => {
          if (res.data.code === '0') {
            let data = res.data.data
            this.smoothLineChartOption.dataset = formatDataSet({ xField: 'name', yField: 'value' }, data)
          }
        })
      },
      // 处理时间，取多天之前。例如一月前 30 三月前 90类似情况。
      timeHandler(days) {
        let getDateStr = (date) => {
          const year = date.getFullYear()
          let month = date.getMonth() + 1
          if (month < 10) month = '0' + month // 小于10补零
          return year + '-' + month
        }

        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days)

        const startDate = getDateStr(start)
        const endDate = getDateStr(end)

        getDateStr = null

        return [startDate, endDate]
      },
      // 获取部门资源列表 用于 select
      async getResources() {
        try {
          const res = await api.getResources()
          this.resources = res
        } catch (error) {
          console.error(error)
        }
      },
      getRandom(start, end, fixed = 0) {
        let differ = end - start
        let random = Math.random()
        return (start + differ * random).toFixed(fixed)
      },
      // 构建月度归集信息默认图表数据
      buildDefaultDataMonth() {
        const date = new Date()
        const year = date.getFullYear()
        const curMonth = date.getMonth() + 1

        const dateArr = []
        for (let i = 0; i < 6; i++) {
          let monthStr = curMonth - i
          let yearStr = date.getFullYear()
          if (monthStr <= 0) {
            yearStr -= 1
            monthStr = 13 - 1
          }
          dateArr.push({
            name: yearStr + '-' + monthStr,
            value: this.getRandom(100, 2000)
          })
        }
        dateArr.reverse()
        this.lineChartOption.dataset = formatDataSet({ xField: 'name', yField: 'value' }, dateArr)
      },
      buildDefaultDataYear() {
        // 构建年度归集信息默认图表数据
        const date = new Date()
        const dateArr = []
        for (let i = 0; i < 12; i++) {
          let monthStr = i + 1
          if (monthStr < 10) monthStr = '0' + monthStr
          dateArr.push({
            name: date.getFullYear() + '-' + monthStr,
            value: this.getRandom(100, 2000)
          })
        }
        this.smoothLineChartOption.dataset = formatDataSet({ xField: 'name', yField: 'value' }, dateArr)
      },
      // 一些初始化操作
      init() {
        // 生成年度归集趋势的tab按钮
        const curYear = new Date().getFullYear()
        this.yearsText = [curYear, curYear - 1, curYear - 2]
        this.buildDefaultDataYear()
        this.buildDefaultDataMonth()
        this.getResources()
        this.searchList()
      }
    }
  }
</script>

<style scoped lang="stylus">
  i {
    font-style: normal
  }
  .my-gather-data {
    .header {
      .msg-tips {
        width: 100%;
        .tip-item {
          display: flex;
          align-items: center;
          width: 19%;
          padding: 20px;
          color: #fff;
          border-radius: 8px;
          .icon {
            background-color: #ffffff44;
            display: inline-block;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 30px;
          }
          .count {
            padding-top: 10px;
            font-size: 26px;
            font-weight: 700;
          }
          &:nth-child(1) {
            background-color: #4065e0;
          }
          &:nth-child(2) {
            background-color: #35a4ff;
          }
          &:nth-child(3) {
            background-color: #6fcafa;
          }
          &:nth-child(4) {
            background-color: #18e5e6;
          }
          &:nth-child(5) {
            background-color: #1ed1b8;
          }
        }
      }
    }
    .title-text {
      font-weight: 500;
    }
    .summary {
      background-color: #1fadf7;
      color #ffffff;
      border-radius: 8px;
      width: 40%;
      margin: 20px;
      margin-top: 0;
      padding-top: 40px;
      position: relative;
      .tip {
        position: absolute;
        top: 10px;
        left: 10px;
        border-radius: 4px;
        border: 1px solid #fff;
        box-shadow: 0 0 2px #eeeeee22;
        line-height: 12px;
        padding: 4px 6px 6px 4px;
      }
      .summary-count {
        font-size: 42px;
        font-weight: 500;
        padding-right: 4px;
        padding-top: 15px;
        display: inline-block;
        height: 50px;
      }
      span {
        font-size: 14px;
        padding-left: 30px;
        line-height: 34px;
        &:nth-child(1) {
          font-size: 18px;
          font-weight: 700;
        }
        &:nth-child(2) {
          font-size: 20px;
          font-weight: 700;
        }
      }
    }
    .trend {
      width: 60%;
      text-align: center;
      .chart-title {
        display: inline-block;
        background-color: #eceffc;
        border-radius: 20px;
        line-height: 30px;
        margin-bottom: 15px;
        width: 180px;
        text-align center;
      }
    }
    .card-layout {
      display: flex;
      justify-content: space-between;
      .left {
        width: calc(100% - 400px)
      }
      .right {
        width: 380px;
      }
    }
    .tab-wrapper {
      position: relative;
      z-index: 1;
      padding: 7px 0;
      width: 210px;
      border: 1px solid #DCDFE6;
      border-radius: 30px;

      .tab {
        width: 70px;
        cursor: pointer;
        font-size: 13px;
        text-align: center;
        border-radius: 30px;
      }

      .slide {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 70px;
        height: 33.6px;
        border-radius: 30px;
        background-color: rgba(233, 233, 255, 0.5);
        transition: left 0.2s;
      }
    }
  }
</style>
