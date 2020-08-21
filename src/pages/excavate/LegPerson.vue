<template>
  <div class="leg-wrap">
    <div class="chart-widget-item">
      <b-card class="box-card" head-tip header="法人成立日期范围分组分析">
        <div flex="box:mean">
          <div>
            <b-charts height="350px" theme="charts-theme" :options="chartOption"/>
          </div>
          <div class="pie-wrap">
            <h4 style="font-size: 14px;text-align: center;">企业数量占比</h4>
            <div class="center-box">
              <h2>企业总数(个)</h2>
              <p>{{ total }}</p>
            </div>
            <b-charts height="300px" theme="charts-theme" :options="pieOption"/>
            <div class="legend-box">
              <div v-for="(item,index) in pieList" :key="index" class="item">
                <span class="dot" :style="{backgroundColor:colorList[index]}"></span>
                <span class="name">{{ item }}</span>
                <span class="percent">{{ qyzbList[index] }}%</span>
                <span class="count">{{ qyList[index] }}</span>
              </div>
            </div>
          </div>
        </div>
      </b-card>
    </div>
    <div class="chart-widget-item">
      <b-card class="box-card" head-tip header="企业行业种类分析">
        <div class="dept-wrap" flex>
          <div style="width: 40%">
            <div style="min-height: 300px;">
              <b-table :columns="columns" :data="data" border ref="deptTable"
                       highlight-row @on-current-change="currentRowChange">
              </b-table>
            </div>
            <div style="padding-top: 10px;text-align: right;">
              <b-page :total="total" :current.sync="currentPage" :page-size="5" @on-change="changeHyPage"></b-page>
            </div>
          </div>
          <div style="width: 40px;" class="center-box">
            <span class="row-tip" v-if="currentRow>-1" :style="{top:64+currentRow*50 +'px'}"></span>
          </div>
          <div style="width: calc(60% - 40px);border: 1px solid #eee;padding: 16px;">
            <h4 style="font-size: 14px;text-align: center;">{{ hy.codeName }}趋势分析</h4>
            <b-charts height="300px" theme="charts-theme" :options="lineChartOption"/>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/excavate.api'
import { formatDataSet } from 'bin-charts/src/utils/util'
import { deepCopy } from '@/common/utils/assist'

const colorList = [
  '#1089ff',
  '#48B3B3',
  '#4FB554',
  '#F0C43A',
  '#D53E54']

export default {
  name: 'LegPerson',
  data() {
    return {
      chartOption: {
        legend: { show: true, bottom: 0, itemWidth: 8, itemHeight: 8, data: ['主体数量'] },
        tooltip: { trigger: 'item' },
        grid: { top: 30, right: 40, left: 30, bottom: 50 },
        xAxis: [{
          type: 'category',
          axisTick: { alignWithLabel: true },
          data: ['0~3年', '3~6年', '6~9年', '9~12年', '12~年']
        }],
        yAxis: [
          {
            type: 'value',
            name: '单位：个',
            position: 'left',
            nameTextStyle: { color: '#666' },
            axisLine: { lineStyle: { color: '#0d85ff' } },
            splitLine: { lineStyle: { type: 'dashed' } }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '主体数量',
            barWidth: '30%',
            barGap: '10%',
            data: []
          }
        ]
      },
      pieList: ['0~3年', '3~6年', '6~9年', '9~12年', '12~年'],
      colorList: colorList,
      pieOption: {
        color: colorList,
        tooltip: { trigger: 'item' },
        series: {
          name: '企业占比',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['30%', '50%'], // 饼图可选
          avoidLabelOverlap: false,
          label: { show: true, position: 'inside', formatter: '{c}' },
          labelLine: { show: false },
          data: []
        }
      },
      qyList: [],
      qyzbList: [],
      columns: [
        { title: '行业', key: 'codeName' },
        { title: '数量', key: 'count', align: 'center' },
        { title: '占比', key: 'percent', align: 'center' }
      ],
      allHy: [], // 所有行业
      data: [],
      currentPage: 1,
      total: 0,
      currentRow: -1,
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
    this.initChart()
    this.getLegHydm()
  },
  methods: {
    // 法人成立日期范围分组分析
    initChart() {
      let { resourceKey } = this.$route.query
      api.getLegClrq(resourceKey).then(resp => {
        if (resp.data.code === '0') {
          let { data } = resp.data
          this.total = data.map(i => i.count).reduce((total, currentValue) => total + currentValue)
          this.qyList = data.map(i => i.count)
          this.qyzbList = data.map(i => (i.count / this.total * 100).toFixed(2))
          this.chartOption.series[0].data = this.qyList
          this.pieOption.series.data = this.qyList.map((item, index) => ({ name: this.pieList[index], value: item }))
        }
      })
    },
    // 行业分布
    getLegHydm() {
      let { resourceKey } = this.$route.query
      api.getLegHydm(resourceKey).then(resp => {
        if (resp.data.code === '0') {
          let { data } = resp.data
          this.total = data.length
          this.allHy = []
          for (let i = 0; i < data.length; i += 5) {
            this.allHy.push(data.slice(i, i + 5))
          }
          this.changeHyPage(1)
        }
      })
    },
    changeHyPage(page) {
      if (page > 0 && page <= this.allHy.length) {
        this.data = deepCopy(this.allHy[page - 1])
      }
      if (this.data.length === 0) {
        this.currentRow = -1
        this.lineChartOption.dataset = formatDataSet({ xField: 'month', yField: 'value' }, [])
        return
      }
      // 默认选中第一行
      this.$nextTick(() => {
        this.$refs.deptTable.clickCurrentRow(0)
      })
    },
    // 行业选中事件
    currentRowChange(currentRow, oldRow, index) {
      this.currentRow = index
      this.handleClickHy(this.data[index])
    },
    // 行业查看趋势分析
    handleClickHy(row) {
      this.hy = { ...row }
      // 根据选择年份，获取这个部门本年度12个月的数据信息
      let { resourceKey } = this.$route.query
      api.getLegHydmTrend(resourceKey, this.activeDeptTabYear, row.code).then(resp => {
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
.leg-wrap {
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

  .dept-wrap {
    .center-box {
      position: relative;
      .row-tip {
        position: absolute;
        left: 12px;
        top: 64px;
        width: 0;
        height: 0;
        transition: top .3s;
        border-top: 10px solid transparent;
        border-left: 14px solid #0d85ff;
        border-bottom: 10px solid transparent;
      }
    }
  }
  .pie-wrap {
    position: relative;
    .center-box {
      position: absolute;
      top: 145px;
      left: 138px;
      width: 100px;
      text-align: center;
      z-index: 10;
      h2 {
        font-size: 16px;
        color: #999;
        border: none;
      }
      p {
        font-size: 18px;
        color: #333;
      }
    }
    .legend-box {
      position: absolute;
      top: 70px;
      right: 38px;
      width: 240px;
      z-index: 10;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin: 0 8px;
        }
        .name {
          width: 55px;
          border-right: 1px solid #eee;
          margin-right: 5px;
        }
        .percent {
          width: 55px;
          margin: 0 5px;
        }
        .count {
          flex: 1;
          text-align: right;
          color: #999;
        }
      }
    }
  }
}
</style>
