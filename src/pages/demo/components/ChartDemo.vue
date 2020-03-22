<template>
  <page-header-wrap>
    <v-table-wrap>
      <b-alert>图表组件b-chart，依赖于echarts
        <template slot="desc">
          <p class="mt-15 mb-15">封装了默认的样式主题，并借助bin-ui提供的方法来实现监听容器组件大小来达到重绘效果，下面是示例</p>
          <p class="mt-15 mb-15">默认可以使用原生options来定义配置项，组件封装了两种默认转换格式函数，以辅助转换不同的数据源类型，来达到配置图表的数据</p>
          <p class="mt-15 mb-15">可以拖拽中线来查看重绘效果，也可以直接修改右侧数据源来动态配置图表数据</p>
        </template>
      </b-alert>
      <div style="width: 100%;height: 425px;border:1px solid #ddd;margin: 20px 0;">
        <b-split :default-percent="50">
          <div slot="left" class="left-container">
            <div id="chart1" style="width: 100%;height: 100%;padding-top:15px;position: relative;">
              <b-chart height="350px" :options="lineChartOption"/>
            </div>
          </div>
          <div slot="right" class="right-container">
            数据源:
            <b-code-editor v-model="dataSource" @on-change="dataSourceChange"/>
          </div>
        </b-split>
      </div>
    </v-table-wrap>
  </page-header-wrap>
</template>

<script>
  import { BChart, formatDataSet } from '../../../components/BChart'

  export default {
    name: 'ChartDemo',
    components: { BChart },
    data() {
      return {
        lineChartOption: {
          tooltip: { trigger: 'axis' },
          title: { text: '默认折线图' },
          grid: { top: 80, right: 30 },
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
