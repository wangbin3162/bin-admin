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
        <b-charts height="350px" ref="chartGather" theme="charts-theme" :options="barChartOption"/>
      </b-card>
    </div>
    <div class="chart-widget-item">
      <b-card class="box-card" head-tip>
        <template v-slot:header>
          <div flex="main:justify cross:center">
            <span>部门数据归集统计分析</span>
            <div class="right" flex="main:justify cross:center">
              <b-button-group style="margin: 0 16px;">
                <b-button v-for="year in yearList" :key="year"
                          :type="activeDeptTabYear===year?'primary':'default'" @click="changeYear(year)">
                  {{ year }}年
                </b-button>
              </b-button-group>
            </div>
          </div>
        </template>
        <b-table :columns="columns" :data="data" border>
          <template #ctrl="{row}">
            <b-button type="text" @click="handleClickDept(row)">
              <svg-icon icon-class="areachart" style="width: 22px;height:22px;"/>
            </b-button>
          </template>
        </b-table>
      </b-card>
    </div>
    <b-modal v-model="analyzeModal" :title="`${depart.departName}-部门趋势分析`" width="800">
      <div class="chart-inner">
        <b-charts height="350px" theme="charts-theme" :options="lineChartOption"/>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { formatDataSet } from 'bin-charts/src/utils/util'

require('bin-charts/src/theme/charts-theme')
export default {
  name: 'GatherAnalyze',
  data() {
    return {
      barChartOption: {
        tooltip: {},
        grid: { top: 50, right: 50, left: 50, bottom: 50 },
        xAxis: { type: 'category' },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', name: '数量', barWidth: '40%' }],
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
      data: [],
      analyzeModal: false,
      depart: {},
      activeDeptTabYear: 2020,
      lineChartOption: {
        tooltip: { trigger: 'axis' },
        grid: { top: 30, right: 30, left: 30, bottom: 30 },
        xAxis: { type: 'category', axisTick: { alignWithLabel: true } },
        yAxis: { type: 'value' },
        series: [{ type: 'line', name: '数量' }],
        dataset: { source: [['x', 'y']] }
      }
    }
  },
  created() {
    let currentYear = new Date().getFullYear()
    this.activeDeptTabYear = currentYear
    this.yearList = [currentYear - 2, currentYear - 1, currentYear]
    this.getYearData()
    this.initDeparts()
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
      this.barChartOption.dataset = formatDataSet({ xField: 'year', yField: 'value' }, data)
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
      this.barChartOption.dataset = formatDataSet({ xField: 'quarter', yField: 'value' }, data)
    },
    // 根据某一年获取对应的12个月份度数据
    getMonthData(year) {
      let data = []
      for (let i = 1; i <= 12; i++) {
        data.push({ month: `${i}月`, value: this.$util.getRandomInt(100, 1000) })
      }
      this.barChartOption.dataset = formatDataSet({ xField: 'month', yField: 'value' }, data)
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
    // 改变年份
    changeYear(year) {
      if (this.activeDeptTabYear === year) return
      this.activeDeptTabYear = year
      this.getDepartList()
    },
    // 图表选中点击事件
    chartClick(params) {
      const { componentType, name, dimensionNames } = params
      if (componentType === 'series' && dimensionNames[0] === 'year' && !this.showMonthData) {
        this.showMonthData = true
        this.currentYear = name
        this.changeTab('quarter')
      }
    },
    // 部门选中查看趋势分析
    handleClickDept(dept) {
      this.depart = { ...dept }
      // 根据选择年份，获取这个部门本年度12个月的数据信息
      console.log(this.activeDeptTabYear, this.depart)

      let data = []
      for (let i = 1; i <= 12; i++) {
        data.push({ month: `${i}月`, value: this.$util.getRandomInt(100, 1000) })
      }
      this.lineChartOption.dataset = formatDataSet({ xField: 'month', yField: 'value' }, data)
      this.analyzeModal = true
    },
    // 获取部门数据归集分析数据
    initDeparts() {
      this.getDepartList()
    },
    // 获取部门数据
    getDepartList() {
      let data = []
      for (let i = 0; i < 5; i++) {
        data.push({
          id: '_id' + i,
          departName: '部门名称' + i,
          gatherCount: this.$util.getRandomInt(1000, 8000),
          proportion: this.$util.getRandomInt(1, 100) + '%'
        })
      }
      this.data = data
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
