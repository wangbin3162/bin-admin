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
            <i>资源信息数量</i>
            <i class="count">{{counts.totalCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>资源信息数量</i>
            <i class="count">{{counts.monthCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>资源信息数量</i>
            <i class="count">{{counts.preMonthCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>资源信息数量</i>
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
              </div>
              <div class="trend">
                <div class="chart-title">月度信息归集趋势</div>
                <div style="width: 100%;height: 100%;">
                  <b-chart height="240px" :options="lineChartOption" :data="chart1Data"/>
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
        <!--月度信息归集趋势-->
        <div class="left">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
                  :body-style="{padding:0,height:'310px'}" shadow="never">
            <template v-slot:header>
              <div flex="main:justify cross:center">
                <span class="title-text">月度信息归集趋势</span>
              </div>
            </template>
            <div style="width: 100%;height: 100%;">
              <b-chart height="280px" :options="smoothLineChartOption" :data="chart2Data"/>
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
  import commonMixin from '../../common/mixins/mixin'
  import permission from '../../common/mixins/permission'
  import * as api from '../../api/data-analyze/data-analysis.api'
  import BChart from '../../components/BChart/index'

  export default {
    name: 'Analyze',
    components: { BChart },
    mixins: [commonMixin, permission],
    data() {
      return {
        listQuery: {
          departId: '',
          month: '2019-01'
        },
        counts: {
          totalResource: '',
          totalCount: '',
          monthCount: '',
          preMonthCount: '',
          completeRate: '',
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
          xAxis: { type: 'category' },
          yAxis: { type: 'value', axisLine: { show: false } },
          series: [{
            type: 'line',
            name: '数量',
            areaStyle: {},
            itemStyle: { color: '#c7c7ff' },
            smooth: false
          }]
        },
        smoothLineChartOption: {
          tooltip: { trigger: 'axis' },
          grid: {
            top: 20,
            bottom: 20
          },
          xAxis: { type: 'category' },
          yAxis: { type: 'value' },
          series: [{
            type: 'line',
            name: '数量',
            itemStyle: { color: '#1ed1b8' },
            areaStyle: {}
          }]
        },
        chart1Data: {
          xField: 'month',
          yField: 'value',
          data: [
            { month: '1月', value: 220 },
            { month: '2月', value: 315 },
            { month: '3月', value: 434 },
            { month: '4月', value: 386 },
            { month: '5月', value: 409 },
            { month: '6月', value: 378 },
            { month: '7月', value: 533 },
            { month: '8月', value: 820 },
            { month: '9月', value: 1290 },
            { month: '10月', value: 1330 },
            { month: '11月', value: 901 },
            { month: '12月', value: 1290 }
          ]
        },
        chart2Data: {
          xField: 'month',
          yField: 'value',
          data: [
            { month: '1月', value: 1220 },
            { month: '2月', value: 1315 },
            { month: '3月', value: 1434 },
            { month: '4月', value: 1386 },
            { month: '5月', value: 1409 },
            { month: '6月', value: 1378 },
            { month: '7月', value: 1533 },
            { month: '8月', value: 1820 },
            { month: '9月', value: 1290 },
            { month: '10月', value: 1330 },
            { month: '11月', value: 901 },
            { month: '12月', value: 1290 }
          ]
        },
        date: new Date(),
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
      this.searchList()
    },
    methods: {
      // 临时设置departId
      resetListQuery() {
        this.listQuery.departId = this.$store.state.user.info.departId
      },
      // 查询所有列表
      searchList() {
        this.resetListQuery()
        // 2.4.1 资源信息数量
        api.getTotalResource(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.totalResource = res.data.data.totalResource
          }
        })
        // 2.4.2 数据归集总量
        api.getTotalCount(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.totalCount = res.data.data.totalCount
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
            this.counts.completeRate = res.data.data.completeRate
          }
        })
        // 2.4.6 本月信息归集统计
        api.getCurCompleteRate(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.counts.curCount = res.data.data.curCount
            this.counts.preCount = res.data.data.preCount
          }
        })
        // 2.4.7 月度信息归集趋势
        /*
        api.getMonthData(this.listQuery).then(res => {
          let data = res.data.data
          let x = data.forEach(item => item.month)
          let y = data.forEach(item => item.value)
          this.lineChartOption ={
            xAxis: {
              type: 'category',
                data: x,
                boundaryGap: false
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: y,
              type: 'line',
              areaStyle: {},
              itemStyle: {
                color: '#c7c7ff'
              },
              symbolSize: 8
            }]
          }
        })
        */
        // 2.4.10 信息归集历史
        api.getDataHistory(this.listQuery).then(res => {
          if (res.data.code === '0') {
            this.historyList = res.data.data.rows
          }
        })
      },
      // 自动重绘表格
      resizeTheChart() {
        if (this.$refs && this.$refs.chart1 && this.$refs.chart2) {
          this.$refs.chart1.resize()
          this.$refs.chart2.resize()
        }
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
  }
</style>
