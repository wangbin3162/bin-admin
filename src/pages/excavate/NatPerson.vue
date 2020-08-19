<template>
  <div class="nat-wrap">
    <b-row :gutter="24">
      <b-col span="12">
        <div class="top-card" style="background-color:#2AC6C3;">
          <div class="right">
            <p>男</p>
            <h2>{{ totalMale }} 人 占比：{{ (totalMale / (totalMale + totalFemale) * 100).toFixed(2) }}%</h2>
          </div>
        </div>
      </b-col>
      <b-col span="12">
        <div class="top-card" style="background-color:#3982ED;">
          <div class="right">
            <p>女</p>
            <h2>{{ totalFemale }} 人 占比：{{ (totalFemale / (totalMale + totalFemale) * 100).toFixed(2) }}%</h2>
          </div>
        </div>
      </b-col>
    </b-row>
    <div class="chart-widget-item">
      <b-card class="box-card" head-tip header="自然人分析">
        <b-charts height="350px" ref="chart1" theme="charts-theme" :options="chartOption1"/>
      </b-card>
    </div>
    <div class="chart-widget-item" v-if="this.$isNotEmpty(ageMap)">
      <b-card class="box-card" head-tip header="人群占比">
        <div class="pie-wrap">
          <div class="pie-item" v-for="(val,key) in ageMap" :key="key">
            <b-charts height="200px" theme="charts-theme" :options="val.chartOption"/>
            <div class="center-box">
              <h2>{{ key }}(人)</h2>
              <p>{{ val.count }}</p>
            </div>
            <p>
              <span class="male">男：{{ val.group.malePercent }}</span>
              <span class="female">女：{{ val.group.femalePercent }}</span>
            </p>
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

export default {
  name: 'NatPerson',
  data() {
    return {
      chartOption1: {
        color: ['#1089ff'],
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { top: 55, right: 60, left: 60, bottom: 30 },
        xAxis: { type: 'category', name: '年龄', nameTextStyle: { color: '#666', align: 'left' } },
        yAxis: {
          type: 'value',
          name: '人数',
          nameTextStyle: { color: '#666' },
          splitLine: { lineStyle: { type: 'dashed' } }
        },
        series: [{ type: 'bar', name: '年龄分布', barWidth: '60%', label: { show: true, position: 'top' } }],
        dataset: { source: [['x', 'y']] }
      },
      pieOption: {
        tooltip: { trigger: 'item' },
        series: [
          {
            name: '人群占比',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'], // 饼图可选
            label: { show: true, position: 'inside', formatter: '{c}' },
            labelLine: { show: false },
            data: []
          }
        ]
      },
      pieList: [],
      ageMap: {},
      totalFemale: 0,
      totalMale: 0
    }
  },
  created() {
    this.initChart1()
  },
  methods: {
    // 自然人年龄分布图
    initChart1() {
      let { resourceKey } = this.$route.query
      api.getGenderRatio(resourceKey).then(resp => {
        if (resp.data.code === '0') {
          let { data } = resp.data
          this.sumAndMap(data)
          this.chartOption1.dataset = formatDataSet({ xField: 'range', yField: 'count' }, data)
        }
      })
    },
    // 分别求和男女总数和年龄分布映射
    sumAndMap(data) {
      let map = {}
      let sumFemale = 0
      let sumMale = 0
      data.forEach(item => {
        let obj = {
          count: item.count
        }
        let female = 0
        let male = 0
        if (item.count > 0) {
          female = item.sexGroup['女'] ? Number.parseInt(item.sexGroup['女']) : 0
          male = item.sexGroup['男'] ? Number.parseInt(item.sexGroup['男']) : 0
          // 扩展map对象
          obj.group = {
            male,
            female,
            malePercent: (male / (male + female) * 100).toFixed(0) + '%',
            femalePercent: (female / (male + female) * 100).toFixed(0) + '%'
          }
          sumFemale += female
          sumMale += male
        } else {
          obj.group = {
            male: 0,
            female: 0,
            malePercent: '0%',
            femalePercent: '0%'
          }
        }
        obj.chartOption = deepCopy(this.pieOption)

        obj.chartOption.series[0].data = [{ value: female, name: '女' }, { value: male, name: '男' }]

        map[item.range] = { ...obj }
      })
      this.ageMap = map
      this.totalFemale = sumFemale
      this.totalMale = sumMale
    }
  }
}
</script>

<style scoped lang="stylus">
.nat-wrap {
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

  .top-card {
    display: flex;
    align-items: center;
    padding: 24px;
    border-radius: 2px;
    margin-bottom: 16px;
    color: #fff;
    &:before {
      content: '';
      width: 60px;
      height: 60px;
      background-color: rgba(255, 255, 255, .2);
      border-radius: 50%;
    }
    .right {
      padding-left: 24px;
      p {
        font-size: 18px;
      }
      h2 {
        font-size: 24px;
        font-weight: normal;
      }
    }
  }
  .pie-wrap {
    display: flex;
    .pie-item {
      position: relative;
      flex: 1;
      height: 300px;
      p {
        text-align: center;
        span {
          display: inline-flex;
          align-items: center;
          margin: 0 5px;
          &:before {
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 4px;
          }
          &.male:before {
            background-color: #1ed1b8;
          }
          &.female:before {
            background-color: #0d85ff;
          }
        }
      }
      .center-box {
        position: absolute;
        top: 76px;
        left: 0;
        width: 100%;
        text-align: center;
        z-index: 10;
        h2 {
          font-size: 14px;
          color: #999;
          border: none;
        }
        p {
          font-size: 16px;
          color: #333;
        }
      }
    }
  }
}
</style>
