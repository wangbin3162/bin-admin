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
            <span>自然人分析</span>
            <div style="width: 200px;text-align: right;">
              <b-date-picker :open="dateRangeOpen" :value="dateRange" confirm type="daterange" placement="bottom-end"
                             @on-change="handleChange" @on-clear="dateRangeOpen = false" @on-ok="dateRangeOpen = false"
              >
                <a href="javascript:void(0)" @click="dateRangeOpen = !dateRangeOpen">
                  <template v-if="dateRange.length===0">选择日期区间</template>
                  <template v-else>{{ dateRange[0] }} ~ {{ dateRange[1] }}</template>
                </a>
              </b-date-picker>
            </div>
          </div>
        </template>
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
      <b-card class="box-card" head-tip>
        <template v-slot:header>
          <div flex="main:justify cross:center">
            <span>法人成立日期范围分组分析</span>
            <div style="width: 200px;text-align: right;">
              <b-date-picker :open="dateRangeOpen2" :value="dateRange2" confirm type="daterange" placement="bottom-end"
                             @on-change="handleChange2" @on-clear="dateRangeOpen2 = false"
                             @on-ok="dateRangeOpen2 = false"
              >
                <a href="javascript:void(0)" @click="dateRangeOpen2 = !dateRangeOpen2">
                  <template v-if="dateRange2.length===0">选择日期区间</template>
                  <template v-else>{{ dateRange2[0] }} ~ {{ dateRange2[1] }}</template>
                </a>
              </b-date-picker>
            </div>
          </div>
        </template>
        <b-charts height="350px" theme="charts-theme" :options="chartOption3"/>
      </b-card>
    </div>
  </div>
</template>

<script>
import { formatDataSet } from 'bin-charts/src/utils/util'

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
      }
    }
  },
  created() {
    this.initChart1()
    this.initChart2()
    this.initChart3()
  },
  mounted() {
    // 注册图表点击事件
    if (this.$refs.chart1) {
      this.$refs.chart1.chart.on('click', this.chartClick)
    }
  },
  methods: {
    // 日期区间1改变事件
    handleChange(date) {
      if (date[0] === '' && date[1] === '') {
        this.dateRange = []
        return
      }
      this.dateRange = date
    },
    // 日期区间2改变事件
    handleChange2(date) {
      if (date[0] === '' && date[1] === '') {
        this.dateRange2 = []
        return
      }
      this.dateRange2 = date
      this.initChart3()
    },
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
      let data = [
        { x: '≤19岁', y: this.$util.getRandomInt(100, 500) },
        { x: '20-29岁', y: this.$util.getRandomInt(100, 500) },
        { x: '30-39岁', y: this.$util.getRandomInt(100, 500) },
        { x: '40-49岁', y: this.$util.getRandomInt(100, 500) },
        { x: '≥50岁', y: this.$util.getRandomInt(100, 500) }
      ]
      this.chartOption1.dataset = formatDataSet({ xField: 'x', yField: 'y' }, data)
    },
    // 根据点选或查询所有男女分布图
    initChart2(type) {
      if (!type) {
        this.chartOption2.title.text = '全部年龄段性别分布'
      } else {
        this.chartOption2.title.text = type + '性别分布'
      }
      let data = [
        { x: '女', y: this.$util.getRandomInt(100, 500) },
        { x: '男', y: this.$util.getRandomInt(100, 500) }
      ]
      this.chartOption2.dataset = formatDataSet({ xField: 'x', yField: 'y' }, data)
    },
    // 法人成立日期范围分组分析
    initChart3() {
      let data1 = []
      let data2 = []
      let sum = 0
      for (let i = 0; i < 5; i++) {
        let num = this.$util.getRandomInt(100, 500)
        data1.push(num)
        sum += num
      }
      for (let i = 0; i < 5; i++) {
        let percent = (data1[i] / sum * 100).toFixed(2)
        data2.push(percent)
      }
      this.chartOption3.series[0].data = data1
      this.chartOption3.series[1].data = data2
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
