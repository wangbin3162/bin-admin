<template>
  <page-header-wrap>
    <v-table-wrap>
      <b-alert>图表组件bin-charts现已独立为插件，依赖echarts
        <template slot="desc">
          具体请查看<a href="https://wangbin3162.gitee.io/bin-charts" target="_blank">示例文档</a>来获取更多插件使用方法
        </template>
      </b-alert>
      <div style="width: 100%;height: 425px;border:1px solid #ddd;margin: 20px 0;">
        <b-split :default-percent="50">
          <div slot="left" class="left-container">
            <div id="chart1" style="width: 100%;height: 100%;padding-top:15px;position: relative;">
              <b-charts height="350px" :options="lineChartOption"/>
            </div>
          </div>
          <div slot="right" class="right-container">
            数据源:
            <b-ace-editor v-model="dataSource" @change="dataSourceChange"></b-ace-editor>
          </div>
        </b-split>
      </div>
    </v-table-wrap>
  </page-header-wrap>
</template>

<script>
  import { formatDataSet } from 'bin-charts/src/utils/util'

  export default {
    name: 'ChartDemo',
    data() {
      return {
        lineChartOption: {
          tooltip: { trigger: 'axis' },
          title: { text: '默认折线图' },
          grid: { top: 80, right: 30 },
          xAxis: { type: 'category', boundaryGap: false },
          yAxis: { type: 'value' },
          series: [{
            type: 'line',
            name: '数量',
            areaStyle: { opacity: 0.4 },
            itemStyle: { color: '#c7c7ff' },
            showSymbol: false
          }],
          dataset: formatDataSet(
            { xField: 'month', yField: 'value' }, []
          )
        },
        dataSource: JSON.stringify([
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
        ], null, 2)
      }
    },
    created() {
      let data = JSON.parse(this.dataSource)
      this.lineChartOption.dataset = formatDataSet(
        { xField: 'month', yField: 'value' }, data
      )
    },
    methods: {
      dataSourceChange(val) {
        try {
          let data = JSON.parse(val)
          this.lineChartOption.dataset = formatDataSet(
            { xField: 'month', yField: 'value' }, data
          )
        } catch (e) {

        }
      }
    }
  }
</script>
