<template>
  <div class="home-wrap">
    <div class="home-header">
      <b-row :gutter="24">
        <b-col span="6">
          <b-card :bordered="false" class="card-panel">
            <div class="top">注册用户数</div>
            <div class="center">
              <div class="count-to">1212</div>
              <div class="charts">
                <b-chart height="70px" :options="chartOptions1"/>
              </div>
            </div>
            <div class="bottom"><span>日注册数</span><span>343</span></div>
          </b-card>
        </b-col>
        <b-col span="6">
          <b-card :bordered="false" class="card-panel">
            <div class="top">发布文章数</div>
            <div class="center">
              <div class="count-to">10200</div>
              <div class="charts">
                <b-chart height="70px" :options="chartOptions2"/>
              </div>
            </div>
            <div class="bottom"><span>日发布文章数</span><span>12</span></div>
          </b-card>
        </b-col>
        <b-col span="6">
          <b-card :bordered="false" class="card-panel">
            <div class="top">用户反馈数</div>
            <div class="center">
              <div class="count-to">12</div>
              <div class="charts">
                <b-chart height="70px" :options="chartOptions3"/>
              </div>
            </div>
            <div class="bottom"><span>日户反馈数</span><span>5</span></div>
          </b-card>
        </b-col>
        <b-col span="6">
          <b-card :bordered="false" class="card-panel">
            <div class="top">网站访问量</div>
            <div class="center">
              <div class="count-to">12121</div>
              <div class="charts">
                <b-chart height="70px" :options="chartOptions4"/>
              </div>
            </div>
            <div class="bottom"><span>日访问量</span><span>3242</span></div>
          </b-card>
        </b-col>
      </b-row>
      <div style="background:#fff;margin:24px 0;">
        <b-chart height="350px" :options="lineOptions"/>
      </div>
      <b-row :gutter="24">
        <b-col span="8">
          <div class="chart-wrapper">
            <b-chart height="300px" :options="radarOptions"/>
          </div>
        </b-col>
        <b-col span="8">
          <div class="chart-wrapper">
            <b-chart height="300px" :options="barOptions"/>
          </div>
        </b-col>
        <b-col span="8">
          <div class="chart-wrapper">
            <b-chart height="300px" :options="roseOptions"/>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import { BChart } from '../components/BChart'

  const animationDuration = 3000
  export default {
    name: 'index',
    components: { BChart },
    data() {
      return {
        chartOptions1: {
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            show: false
          },
          yAxis: {
            type: 'value',
            show: false
          },
          series: [{
            name: '用户注册数',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [22, 34, 11, 24, 22, 8, 12]
          }]
        },
        chartOptions2: {
          xAxis: {
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            show: false
          },
          yAxis: {
            show: false
          },
          grid: {
            left: -20,
            right: 3,
            bottom: 0,
            top: 0,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis'
          },
          series: [
            {
              name: '发布',
              type: 'line',
              data: [10, 12, 16, 13, 10, 16, 16]
            },
            {
              name: '草稿',
              type: 'line',
              data: [2, 8, 9, 15, 16, 14, 14]
            }
          ]
        },
        chartOptions3: {
          tooltip: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            height: 60,
            containLabel: true
          },
          xAxis: {
            type: 'value',
            show: false,
            max: 22
          },
          yAxis: {
            type: 'category',
            show: false
          },
          series: [
            {
              name: '反馈数量',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'insideRight'
                }
              },
              data: [12]
            },
            {
              name: '回复数量',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'insideRight'
                }
              },
              data: [10]
            }
          ]
        },
        chartOptions4: {
          tooltip: {},
          grid: {
            left: '5%',
            right: '5%'
          },
          xAxis: {
            show: false,
            data: [1, 2, 3, 4, 5, 6, 7]
          },
          yAxis: {
            show: false
          },
          series: [{
            name: '访问数量',
            type: 'bar',
            data: [179, 152, 200, 334, 390, 330, 220],
            itemStyle: {
              color: '#fa6b9b',
              barBorderRadius: 4
            }
          }]
        },
        lineOptions: {
          xAxis: {
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 20,
            right: 30,
            bottom: 20,
            top: 50,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          legend: {
            data: ['预期', '实际']
          },
          series: [{
            name: '预期',
            itemStyle: {
              color: '#FF005A'
            },
            smooth: true,
            type: 'line',
            data: [100, 120, 161, 134, 105, 160, 165]
          },
            {
              name: '实际',
              smooth: true,
              type: 'line',
              itemStyle: {
                color: '#3888fa'
              },
              areaStyle: { opacity: 0.1 },
              data: [120, 82, 91, 154, 162, 140, 145]
            }]
        },
        radarOptions: {
          tooltip: {
            trigger: 'axis'
          },
          radar: {
            radius: '66%',
            center: ['50%', '42%'],
            splitNumber: 8,
            splitArea: {
              areaStyle: {
                color: 'rgba(127,155,184,0.3)',
                opacity: 1,
                shadowBlur: 45,
                shadowColor: 'rgba(0,0,0,.5)',
                shadowOffsetX: 0,
                shadowOffsetY: 15
              }
            },
            indicator: [
              { name: '行政', max: 10000 },
              { name: '管理', max: 20000 },
              { name: '科技', max: 20000 },
              { name: '服务', max: 20000 },
              { name: '开发', max: 20000 },
              { name: '市场', max: 20000 }
            ]
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: ['北京', '上海']
          },
          series: [{
            type: 'radar',
            symbolSize: 0,
            areaStyle: {
              normal: {
                shadowBlur: 13,
                shadowColor: 'rgba(0,0,0,.2)',
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                opacity: 1
              }
            },
            data: [
              {
                value: [6000, 12000, 14000, 11000, 15000, 14000],
                name: '北京'
              },
              {
                value: [4000, 9000, 15000, 15000, 13000, 11000],
                name: '上海'
              }
            ]
          }]
        },
        barOptions: {
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: [{
            name: 'pageA',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [179, 52, 200, 334, 390, 330, 220]
          }, {
            name: 'pageB',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [80, 52, 200, 334, 390, 330, 220]
          }, {
            name: 'pageC',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [66, 52, 200, 334, 390, 330, 220]
          }]
        },
        roseOptions: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: ['Vue', 'React', 'Angular', 'Jquery', 'Node']
          },
          calculable: true,
          series: [
            {
              name: '前端技术占比',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: [
                { value: 320, name: 'Vue' },
                { value: 332, name: 'React' },
                { value: 211, name: 'Angular' },
                { value: 176, name: 'Node' },
                { value: 66, name: 'Jquery' }
              ]
            }
          ]
        }
      }
    }
  }
</script>

<style lang="stylus">
  .home-header {
    .card-panel {
      .top {
        color: rgba(0, 0, 0, .45);
        font-size: 14px;
        line-height: 22px;
        height: 22px;
      }
      .center {
        height: 100px;
        .count-to {
          color: rgba(0, 0, 0, .85);
          margin-top: 4px;
          margin-bottom: 0;
          font-size: 30px;
          line-height: 38px;
          height: 38px;
        }
        .charts {
          height: 70px;
        }
      }
      .bottom {
        border-top: 1px solid #e8e8e8;
        padding-top: 9px;
        margin-top: 8px;
        font-size: 14px;
        line-height: 22px;
        span {
          display: inline-block;
          margin-right: 8px;
        }
      }
    }
  }
  .chart-wrapper {
    position: relative;
    width: 100%;
    background: #fff;
    padding: 16px;
    margin-bottom: 25px;
  }
</style>
