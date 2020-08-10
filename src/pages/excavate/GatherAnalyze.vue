<template>
  <div class="gather-analyze">
    <div class="filter">
      <b-date-picker style="width: 200px;" type="date" separator=" ~ " size="small"
                     placeholder="select date"></b-date-picker>
    </div>
    <!--图表区域-->
    <div class="chart-widget-item">
      <b-card class="box-card" head-tip>
        <template v-slot:header>
          <div flex="main:justify cross:center">
            <span>信息归集趋势</span>
            <div class="right" v-if="showMonthData" flex="main:justify cross:center">
              <b-button type="text" text-color="#999" @click="getYearData">
                <b-icon name="ios-undo" size="20"/>
                返回
              </b-button>
              <b-button-group style="margin: 0 16px;">
                <b-button :type="activeTab==='quarter'?'primary':'default'" @click="changeTab('quarter')">季度</b-button>
                <b-button :type="activeTab==='month'?'primary':'default'" @click="changeTab('month')">月度</b-button>
              </b-button-group>
              <span style="font-size: 14px;color:#1089ff;">{{ currentYear }}</span>
            </div>
          </div>
        </template>
        <b-charts height="350px" ref="chartGather" theme="charts-theme" :options="lineChartOption"/>
      </b-card>
    </div>
    <div class="chart-widget-item">
      <b-card class="box-card" head-tip>
        <template v-slot:header>
          <div flex="main:justify cross:center">
            <span>部门数据归集统计分析</span>
          </div>
        </template>
        <b-table :columns="columns" :data="data" border>
          <template #ctrl="{row}">
            <b-button type="text">
              <svg-icon icon-class="areachart" style="width: 22px;height:22px;"/>
            </b-button>
          </template>
        </b-table>
      </b-card>
    </div>
  </div>
</template>

<script>
import { formatDataSet } from 'bin-charts/src/utils/util'

require('bin-charts/src/theme/charts-theme')
export default {
  name: 'GatherAnalyze',
  data() {
    return {
      lineChartOption: {
        tooltip: {},
        grid: { top: 50, right: 50, left: 50, bottom: 50 },
        xAxis: { type: 'category' },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', name: '数量' }],
        dataset: { source: [['x', 'y']] }
      },
      yearList: [],
      currentYear: '',
      showMonthData: false, // 显示月份内容
      activeTab: 'quarter',
      columns: [
        { title: '部门', key: 'departName' },
        { title: '归集数量', key: 'gatherCount', align: 'center' },
        { title: '占比', key: 'proportion', align: 'center' },
        { title: '趋势分析', slot: 'ctrl', align: 'center' }
      ],
      data: [
        { departName: '部门名称', gatherCount: 888234, proportion: '8%' },
        { departName: '部门名称', gatherCount: 123231, proportion: '5%' },
        { departName: '部门名称', gatherCount: 1244, proportion: '1%' },
        { departName: '部门名称', gatherCount: 123123, proportion: '5%' },
        { departName: '部门名称', gatherCount: 45523, proportion: '5%' }
      ]
    }
  },
  created() {
    let currentYear = new Date().getFullYear()
    this.yearList = [currentYear - 2, currentYear - 1, currentYear]
    this.getYearData()
  },
  mounted() {
    // 注册图表点击事件
    if (this.$refs.chartGather) {
      this.$refs.chartGather.chart.on('click', this.chartClick)
    }
  },
  methods: {
    // 获取年份的方法
    getYearData() {
      let data = []
      for (let i = 0; i < this.yearList.length; i++) {
        data.push({ year: `${this.yearList[i]}年`, value: this.$util.getRandomInt(100, 1000) })
      }
      this.lineChartOption.dataset = formatDataSet({ xField: 'year', yField: 'value' }, data)
      // 清空季度月度标识
      this.showMonthData = false
      this.activeTab = ''
    },
    // 根据某一年获取对应的4个季度数据
    getQuarterData(year) {
      let data = []
      for (let i = 1; i <= 4; i++) {
        data.push({ quarter: `${i}季度`, value: this.$util.getRandomInt(100, 1000) })
      }
      this.lineChartOption.dataset = formatDataSet({ xField: 'quarter', yField: 'value' }, data)
    },
    // 根据某一年获取对应的12个月份度数据
    getMonthData(year) {
      let data = []
      for (let i = 1; i <= 12; i++) {
        data.push({ month: `${i}月`, value: this.$util.getRandomInt(100, 1000) })
      }
      this.lineChartOption.dataset = formatDataSet({ xField: 'month', yField: 'value' }, data)
    },
    // 改变季度月度
    changeTab(type) {
      if (this.activeTab === type) return
      this.activeTab = type
      if (type === 'quarter') {
        this.getQuarterData()
      } else {
        this.getMonthData()
      }
    },
    chartClick(params) {
      const { componentType, name, dimensionNames } = params
      console.log(params)
      if (componentType === 'series' && dimensionNames[0] === 'year' && !this.showMonthData) {
        this.showMonthData = true
        this.currentYear = name
        this.changeTab('quarter')
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.gather-analyze {
  .filter {
    text-align: right;
    margin-bottom: 8px;
  }

  .chart-widget-item {
    position: relative;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 5px 1px rgba(100, 100, 100, .1);
    margin-bottom: 16px;
    h2 {
      font-weight: normal;
      font-size: 16px;
      border-bottom: 1px solid #eeeeee;
      padding: 6px 2px;
      span {
        position: relative;
        line-height: 30px;
        padding: 0 18px;
        &:before {
          content: '';
          position: absolute;
          left: 2px
          top: 2px;
          bottom: 2px;
          width: 2px;
          background-color: #1089ff;
        }
      }
    }
  }
}
</style>
