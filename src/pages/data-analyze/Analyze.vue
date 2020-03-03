<template>
  <div class="my-gather-data">
    <div class="header mb-20">
      <div class="msg-tips" flex="main:justify">
        <div class="tip-item" flex="main">
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>资源信息数量</i>
            <i class="count">{{counts.totalResource}}</i>
          </span>
        </div>
        <div class="tip-item" flex="main">
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>资源信息数量</i>
            <i class="count">{{counts.totalCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex="main">
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>资源信息数量</i>
            <i class="count">{{counts.monthCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex="main">
          <span class="icon">
            <img src="" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i>资源信息数量</i>
            <i class="count">{{counts.preMonthCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex="main">
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
      <b-row :gutter="20">
        <!--本月信息归集统计-->
        <b-col span="16">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
                  :body-style="{padding:0,height:'310px'}">
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
                              :showText="false"></b-progress>
                </span>
                <span>再录{{counts.preCount - counts.curCount}}条就超过上月了哦，继续加油！</span>
              </div>
              <div class="trend">
                <div class="chart-title">月度信息归集趋势</div>
                <v-chart ref="chart1" :options="lineChartOption" style="height: 280px;width: 100%"></v-chart>
              </div>
            </div>
          </b-card>
        </b-col>
        <!--信息归集日历-->
        <b-col span="8">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
                  :body-style="{padding:0,height:'310px'}">
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
        </b-col>
      </b-row>
      <div class="pt-20"></div>
      <b-row :gutter="20">
        <!--月度信息归集趋势-->
        <b-col span="16">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
                  :body-style="{padding:0,height:'310px'}">
            <template v-slot:header>
              <div flex="main:justify cross:center">
                <span class="title-text">月度信息归集趋势</span>
              </div>
            </template>
            <div class="content" flex="main:justify">
              <v-chart ref="chart2" :options="smoothLineChartOption" style="width: 100%;height: 280px;"></v-chart>
            </div>
          </b-card>
        </b-col>
        <!--信息归集历史-->
        <b-col span="8">
          <b-card class="box-card" head-tip divider="no" :bordered="false" radius="10px"
                  :body-style="{height:'310px'}">
            <template v-slot:header>
              <div flex="main:justify cross:center">
                <span class="title-text">信息归集历史</span>
              </div>
            </template>
            <b-table :columns="columns" :data="historyList" size="small"></b-table>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import commonMixin from '../../common/mixins/mixin'
  import permission from '../../common/mixins/permission'
  import * as api from '../../api/data-analyze/data-analysis.api'

  export default {
    name: 'Analyze',
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
          xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            boundaryGap: false
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320, 901, 934, 1290, 1330, 1320],
            type: 'line',
            areaStyle: {},
            itemStyle: {
              color: '#c7c7ff'
            },
            symbolSize: 8
          }]
        },
        smoothLineChartOption: {
          xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            boundaryGap: false
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320, 901, 934, 1290, 1330, 1320],
            type: 'line',
            itemStyle: {
              color: '#1ed1b8'
            },
            symbolSize: 8,
            areaStyle: {
              color: '#1ed1b8'
            },
            markPoint: {
              symbol: 'rect'
            },
            smooth: true
          }]
        },
        date: new Date(),
        columns: [
          { title: '资源信息', key: 'resourceName' },
          { title: '归集数量', key: 'count', align: 'center' },
          { title: '归集日期', key: 'date' }
        ],
        historyList: [],
        resourceList: [],
        yearList: [],
        yearSelect: ''
      }
    },
    created() {
      this.setYearList()
      this.searchList()
    },
    mounted() {
      window.addEventListener('resize', this.resizeTheChart)
    },
    methods: {
      setYearList() {
        let yearList = new Date().getFullYear()
        this.yearList.push(yearList, yearList - 1, yearList - 2)
      },
      // 临时设置departId
      resetListQuery() {
        this.listQuery.departId = this.$store.state.user.info.departId
      },
      // 查询所有列表
      searchList() {
        this.resetListQuery()
        // 2.4.1 资源信息数量
        api.getTotalResource(this.listQuery).then(res => {
          this.counts.totalResource = res.data.data.totalResource
        })
        // 2.4.2 数据归集总量
        api.getTotalCount(this.listQuery).then(res => {
          this.counts.totalCount = res.data.data.totalCount
        })
        // 2.4.3 本月归集数据量
        api.getCurMonthCount(this.listQuery).then(res => {
          this.counts.monthCount = res.data.data.monthCount
        })
        // 2.4.4 上月归集数据量
        api.getPreMonthCount(this.listQuery).then(res => {
          this.counts.preMonthCount = res.data.data.preMonthCount
        })
        // 2.4.5 数据完整率
        api.getCompleteRate(this.listQuery).then(res => {
          this.counts.completeRate = res.data.data.completeRate
        })
        // 2.4.6 本月信息归集统计
        api.getCurCompleteRate(this.listQuery).then(res => {
          this.counts.curCount = res.data.data.curCount
          this.counts.preCount = res.data.data.preCount
          // this.counts.percent = this.counts.curCount / res.data.data.preCount
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
          this.historyList = res.data.data.rows
        })
      },
      // 自动重绘表格
      resizeTheChart() {
        if (this.$refs) {
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
            font-size: 18px;
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
        font-size: 38px;
        font-weight: 700;
        padding-right: 4px;
        padding-top: 15px;
        display: inline-block;
        height: 50px;
      }
      span {
        font-size: 12px;
        padding-left: 30px;
        line-height: 30px;
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
      width: 60%
      position relative
      .chart-title {
        position absolute
        left 50%
        transform translateX(-50%)
        background-color: #eceffc
        -webkit-border-radius: 20px
        -moz-border-radius: 20px
        border-radius: 20px
        line-height: 40px
        width: 180px
        text-align center
      }
    }
  }
</style>
