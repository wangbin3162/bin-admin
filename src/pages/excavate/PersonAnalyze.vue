<template>
  <div class="gather-analyze">
    <!--图表区域-->
    <div class="chart-widget-item">
      <b-card class="box-card" head-tip header="自然人分析">
        <div flex="box:mean">
          <div class="chart-wrap">
            <b-charts height="350px" ref="chart1" theme="charts-theme" :options="chartOption1"/>
          </div>
          <div class="chart-wrap" style="border-left: 1px solid #eeeeee;">
            <b-charts height="350px" theme="charts-theme" :options="chartOption2"/>
          </div>
        </div>
      </b-card>
    </div>
    <div class="chart-widget-item">
      <b-card class="box-card" head-tip header="法人成立日期范围分组分析">
        <b-charts height="350px" theme="charts-theme" :options="chartOption3"/>
      </b-card>
    </div>
    <div class="chart-widget-item">
      <b-card class="box-card" head-tip>
        <template v-slot:header>
          <div flex="main:justify cross:center">
            <span>企业行业种类分析</span>
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
            <b-button type="text" @click="handleClickHy(row)">
              <svg-icon icon-class="areachart" style="width: 22px;height:22px;"/>
            </b-button>
          </template>
        </b-table>
      </b-card>
    </div>
    <b-modal v-model="analyzeModal" :title="`${hy.codeName}-趋势分析`" width="800">
      <div class="chart-inner">
        <b-charts height="350px" theme="charts-theme" :options="lineChartOption"/>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { formatDataSet } from 'bin-charts/src/utils/util'
import * as api from '@/api/excavate.api'

require('bin-charts/src/theme/charts-theme')
export default {
  name: 'PersonAnalyze',
  data() {
    return {
      dateRangeOpen: false,
      dateRange: [],
      dateRangeOpen2: false,
      dateRange2: [],
      chooseAge: '',
      chartOption1: {
        color: ['#1089ff'],
        title: { text: '自然人年龄分布', textStyle: { fontSize: 14, color: '#666' } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { top: 55, right: 40, left: 30, bottom: 30 },
        xAxis: { type: 'category', name: '年龄', nameTextStyle: { color: '#666', align: 'left' } },
        yAxis: {
          type: 'value',
          name: '人数',
          nameTextStyle: { color: '#666' },
          splitLine: { lineStyle: { type: 'dashed' } }
        },
        series: [{ type: 'bar', name: '年龄分布', barWidth: '60%' }],
        dataset: { source: [['x', 'y']] }
      },
      chartOption2: {
        color: ['#1089ff'],
        title: { text: '性别分布', textStyle: { fontSize: 14, color: '#666' } },
        tooltip: {},
        grid: { top: 55, right: 40, left: 30, bottom: 30 },
        xAxis: { type: 'category', name: '性别', nameTextStyle: { color: '#666', align: 'left' } },
        yAxis: {
          type: 'value',
          name: '人数',
          nameTextStyle: { color: '#666' },
          splitLine: { lineStyle: { type: 'dashed' } }
        },
        series: [{ type: 'bar', name: '性别分布', barWidth: '60%' }],
        dataset: { source: [['x', 'y']] }
      },
      chartOption3: {
        color: ['#0d85ff', '#2bcfcf'],
        legend: { show: true, bottom: 0, itemWidth: 8, itemHeight: 8, data: ['主体数量', '占比'] },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        grid: { top: 30, right: 40, left: 30, bottom: 50 },
        xAxis: [{
          type: 'category',
          axisTick: { alignWithLabel: true },
          data: ['0~3年', '3~6年', '6~9年', '9~12年', '12~年']
        }],
        yAxis: [
          {
            type: 'value',
            name: '主体数量',
            position: 'left',
            nameTextStyle: { color: '#666' },
            axisLine: { lineStyle: { color: '#0d85ff' } },
            splitLine: { lineStyle: { type: 'dashed' } }
          },
          {
            type: 'value',
            name: '占比',
            position: 'right',
            nameTextStyle: { color: '#666' },
            axisLine: { lineStyle: { color: '#2bcfcf' } },
            axisLabel: { formatter: '{value}%' }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '主体数量',
            barWidth: '30%',
            barGap: '10%',
            data: [100, 234, 458, 300, 192]
          },
          {
            type: 'bar',
            name: '占比',
            yAxisIndex: 1,
            barWidth: '30%',
            data: [1, 25, 25, 15, 12]
          }
        ]
      },
      columns: [
        { title: '行业', key: 'codeName' },
        { title: '数量', key: 'count', align: 'center' },
        { title: '占比', key: 'percent', align: 'center' },
        { title: '趋势分析', slot: 'ctrl', align: 'center' }
      ],
      data: [],
      yearList: [],
      currentYear: '',
      activeDeptTabYear: 2020,
      analyzeModal: false,
      hy: {},
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
    this.currentYear = currentYear.toString()
    this.activeDeptTabYear = currentYear
    this.yearList = [currentYear - 2, currentYear - 1, currentYear]
    this.initChart1()
    this.initChart3()
    this.getLegHydm()
  },
  mounted() {
    // 注册图表点击事件
    if (this.$refs.chart1) {
      this.$refs.chart1.chart.on('click', this.chartClick)
    }
  },
  methods: {
    // 图表选中点击事件
    chartClick(params) {
      const { componentType, name } = params
      if (componentType === 'series') {
        if (this.chooseAge !== name) {
          this.chooseAge = name
          this.initChart2(name)
        } else {
          this.chooseAge = ''
          this.initChart2()
        }
      }
    },
    // 自然人年龄分布图
    initChart1() {
      let { resourceKey } = this.$route.query
      api.getGenderRatio(resourceKey).then(resp => {
        if (resp.data.code === '0') {
          let { data } = resp.data
          this.sumAndMap(data)
          this.initChart2() // 加载全部男女
          this.chartOption1.dataset = formatDataSet({ xField: 'range', yField: 'count' }, data)
        }
      })
    },
    // 根据点选或查询所有男女分布图
    initChart2(type) {
      let data = []
      if (!type) {
        this.chartOption2.title.text = '全部年龄段性别分布'
        data = [
          { x: '女', y: this.totalFemale },
          { x: '男', y: this.totalMale }
        ]
      } else {
        this.chartOption2.title.text = type + '性别分布'
        data = [
          { x: '女', y: this.ageMap[type].sexGroup['女'] || 0 },
          { x: '男', y: this.ageMap[type].sexGroup['男'] || 0 }
        ]
      }
      this.chartOption2.dataset = formatDataSet({ xField: 'x', yField: 'y' }, data)
    },
    // 分别求和男女总数和年龄分布映射
    sumAndMap(data) {
      let map = {}
      let sumFemale = 0
      let sumMale = 0
      data.forEach(item => {
        map[item.range] = { count: item.count, sexGroup: item.sexGroup }
        if (item.count > 0) {
          if (item.sexGroup['女']) {
            sumFemale += Number.parseInt(item.sexGroup['女'])
          }
          if (item.sexGroup['男']) {
            sumMale += Number.parseInt(item.sexGroup['男'])
          }
        }
      })
      this.ageMap = map
      this.totalFemale = sumFemale
      this.totalMale = sumMale
    },
    // 法人成立日期范围分组分析
    initChart3() {
      let { resourceKey } = this.$route.query
      api.getLegClrq(resourceKey).then(resp => {
        if (resp.data.code === '0') {
          let { data } = resp.data
          let sum = data.map(i => i.count).reduce((total, currentValue) => total + currentValue)
          let data1 = data.map(i => i.count)
          let data2 = data.map(i => (i.count / sum * 100).toFixed(2))
          this.chartOption3.series[0].data = data1
          this.chartOption3.series[1].data = data2
        }
      })
    },
    // 行业分布
    getLegHydm() {
      let { resourceKey } = this.$route.query
      api.getLegHydm(resourceKey).then(resp => {
        if (resp.data.code === '0') {
          let { data } = resp.data
          // let sum = data.map(i => i.count).reduce((total, currentValue) => total + currentValue)
          this.data = data
        }
      })
    },
    // 改变年份
    changeYear(year) {
      if (this.activeDeptTabYear === year) return
      this.activeDeptTabYear = year
      this.getLegHydm()
    },
    // 部门行业查看趋势分析
    handleClickHy(row) {
      this.hy = { ...row }
      // 根据选择年份，获取这个部门本年度12个月的数据信息
      let { resourceKey } = this.$route.query
      api.getGatherDeptTrend(resourceKey, this.activeDeptTabYear, row.code).then(resp => {
        if (resp.data.code === '0') {
          let data = resp.data.data.map(i => ({ month: i.range + '月', value: i.count }))
          this.lineChartOption.dataset = formatDataSet({ xField: 'month', yField: 'value' }, data)
          this.analyzeModal = true
        }
      })
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
    .chart-wrap {
      padding: 0 16px;
    }
  }
}
</style>
