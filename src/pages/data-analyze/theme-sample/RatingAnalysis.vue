<template>
  <div id="app" class="my-gather-data p20">
    <div class="header mb-20">
      <div class="msg-tips" flex="main:justify">
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_xxsl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="法人和其他组织报告数量（个）">法人和其他组织报告数量（个）</i>
            <i class="count">{{counts.cnt}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_gjzl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="自然人报告数量（个）">自然人报告数量（个）</i>
            <i class="count">{{counts.totalCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_gjsj.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="信用报告数量（个）">信用报告数量（个）</i>
            <i class="count">{{counts.monthCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_sjzl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="核查报告（个）">核查报告（个）</i>
            <i class="count">{{counts.zrpCount}}</i>
          </span>
        </div>
        <div class="tip-item" flex>
          <span class="icon">
            <img src="../../../assets/images/big-data-icon/icon_frsjzl.png" alt="">
          </span>
          <span class="info" flex="dir:top">
            <i t-ellipsis title="指标数量（个）">指标数量（个）</i>
            <i class="count">{{counts.foCount}}</i>
          </span>
        </div>
      </div>
    </div>

    <div class="main">
      <div class="card-layout mb-20">
        <div class="left">
          <b-card head-tip divider="no" :bordered="false" radius="10px"
            :body-style="{ padding: 0, height: '310px' }" shadow="never">

            <template v-slot:header>
              <div flex="main:justify cross:center" class="header-height">
                <span class="title-text">评级等级分析</span>
                <type-switch-btn :tabs="tabs"></type-switch-btn>
              </div>
            </template>

            <div class="pl-15 pr-15">
              <b-charts :options="chartA" height="280px"></b-charts>
            </div>

          </b-card>
        </div>

        <div class="right">
          <b-card head-tip divider="no" :bordered="false" radius="10px"
            :body-style="{ padding:0, height:'310px' }" shadow="never">

            <template v-slot:header>
              <div flex="main:justify cross:center" class="header-height">
                <span class="title-text">评级报告用途分析</span>
              </div>
            </template>

            <div>
              <b-charts :options="chartB" height="230px"></b-charts>
              <div class="use-con">
                <div flex="dir:top" class="use-item">
                  <b-tag type="primary" no-border dot>优先评选</b-tag>
                  <span class="text">30</span>
                </div>

                <div class="divider"></div>

                <div flex="dir:top" class="use-item">
                  <b-tag type="warning" no-border dot>资格评审</b-tag>
                  <span class="text">30</span>
                </div>

                <div class="divider"></div>

                <div flex="dir:top" class="use-item">
                  <b-tag type="success" no-border dot>扶持贷款</b-tag>
                  <span class="text">30</span>
                </div>

                <div class="divider"></div>

                <div flex="dir:top" class="use-item">
                  <b-tag type="danger" no-border dot>信用激励</b-tag>
                  <span class="text">30</span>
                </div>

                <div class="divider"></div>

                <div flex="dir:top" class="use-item">
                  <b-tag type="info" no-border dot>容缺办理</b-tag>
                  <span class="text">30</span>
                </div>
              </div>
            </div>

          </b-card>
        </div>
      </div>

      <b-card head-tip divider="no" :bordered="false" radius="10px"
        :body-style="{ padding: 0, height: '310px' }" shadow="never">

        <template v-slot:header>
          <div flex="main:justify cross:center" class="header-height">
            <span class="title-text">主体评级分数变化趋势</span>

            <div flex="cross:center">
              <!-- <b-date-picker type="daterange" placement="bottom-end" placeholder="Select date"
                :value="resInfoDate"
                format="yyyy-MM" @on-change="handleResDateChange">
              </b-date-picker> -->
              <groove-select></groove-select>
              <type-switch-btn :tabs="tabs"></type-switch-btn>
            </div>

          </div>
        </template>

        <div style="width: 100%; height: 100%; position: relative;">
          <b-charts :options="chartC" theme="charts-theme" height="280px"></b-charts>
        </div>

      </b-card>
    </div>

  </div>
</template>

<script>
  import { formatDataSet, formatSeries } from 'bin-charts/src/utils/util'
  import { getTimeRange } from '../../../common/utils/util'

  import GrooveSelect from '../components/GrooveSelect'
  import TypeSwitchBtn from '../components/TypeSwitchBtn'

  require('bin-charts/src/theme/charts-theme')

  export default {
    name: 'RatingAnalysis',
    components: { GrooveSelect, TypeSwitchBtn },
    data() {
      return {
        tabs: [
          { key: 'A02', title: '法人和其他组织' },
          { key: 'A01', title: '自然人' }
        ],
        commonDate: [], // 部门数据归集统计分析、资源信息分类统计、最新提报部门使用的时间参数
        departDate: [], // 部门数据归集统计分析日期选择框
        curDate: this.$util.parseTime(new Date(), '{y}-{m}-{d}'),
        resInfoDate: [], // 资源信息归集趋势日期选择框
        tabSelected: 2,
        query: {
          startDate: '',
          endDate: '',
          pageSize: 20,
          personClass: 'nat'
        },
        counts: {
          cnt: '',
          totalCount: '',
          monthCount: '',
          zrpCount: '',
          foCount: ''
        },
        lineSmoothChartOption: {
          tooltip: { trigger: 'axis' },
            color: ['#3cd7c1', '#a2a4fe', '#6fcafa', '#18e5e6', '#1ed1b8'],
            grid: {
              top: '12%',
              left: '6%',
              right: '3%',
              bottom: '12%'
            },
            legend: {
              // bottom: 0
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              splitLine: { show: true },
              axisLabel: { formatter: '{value} 月' }
            },
            yAxis: {
              name: '（条）        ',
              type: 'value',
              splitLine: { show: true },
              nameTextStyle: {
                color: '#000000'
              }
            },
            series: [
              {
                smooth: true,
                type: 'line',
                showSymbol: false,
                areaStyle: { opacity: 0.45 }
              },
              {
                smooth: true,
                type: 'line',
                showSymbol: false,
                areaStyle: { opacity: 0.45 }
              }
            ],
            dataset: { source: [
              ['month', '自然人', '法人及其他组织'],
              ['1', '0', '0'],
              ['2', '0', '0'],
              ['3', '0', '0'],
              ['4', '0', '0'],
              ['5', '0', '0'],
              ['6', '0', '0'],
              ['7', '0', '0'],
              ['8', '0', '0'],
              ['9', '0', '0'],
              ['10', '0', '0'],
              ['11', '0', '0'],
              ['12', '0', '0']
            ] }
        },
        barChartOption: {
          color: '#3cd7c1',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            top: '3%',
            left: '3%',
            right: '3%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#b8b8b8'
              }
            },
            axisLabel: {
              color: '#333'
            }
          },
          yAxis: {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#b8b8b8'
              }
            },
            axisLabel: {
              color: '#333'
            }
          },
          series: {
            name: '数量',
            type: 'bar'
          },
          dataset: { source: [
            ['resourceName', 'value'],
            ['基本信息', '0'],
            ['业务信息', '0'],
            ['司法信息', '0'],
            ['行政执法信息', '0'],
            ['公共事业信息', '0'],
            ['信用评级信息', '0'],
            ['其他信息', '0']
          ] }
        },
        chartA: {
          color: '#3cd7c1',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            top: '3%',
            left: '3%',
            right: '3%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#b8b8b8'
              }
            },
            axisLabel: {
              color: '#333'
            }
          },
          yAxis: {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#b8b8b8'
              }
            },
            axisLabel: {
              color: '#333'
            }
          },
          series: {
            name: '数量',
            type: 'bar'
          },
          dataset: { source: [
            ['ratingLevel', 'value'],
            ['等级A', 1000],
            ['等级B', 900],
            ['等级C', 800],
            ['等级D', 700],
            ['等级E', 600],
            ['等级F', 500],
            ['等级G', 400]
          ] }
        },
        chartB: {
          tooltip: {},
          radar: {
            name: {
              textStyle: {
                color: '#595959'
              }
            },
            indicator: [
              { name: '评先优选', max: 6500 },
              { name: '缺容办理', max: 16000 },
              { name: '信用激励', max: 30000 },
              { name: '扶持贷款', max: 38000 },
              { name: '资格评审', max: 52000 }
            ]
          },
          series: {
            name: '预算 vs 开销（Budget vs spending）',
            type: 'radar',
            data: [
              // {
              //   value: [4300, 10000, 28000, 35000, 50000, 19000],
              //   name: '预算分配（Allocated Budget）'
              // },
              {
                value: [5000, 14000, 28000, 31000, 42000, 21000],
                name: '评级报告用途分析'
              }
            ]
          }
        },
        chartC: {
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            top: '7%',
            bottom: '15%',
            containLabel: true
          },
          legend: {
            data: ['A', 'B', 'C', 'D'],
            bottom: 0
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [
              '1月', '2月', '3月', '4月', '5月', '6月', '7月',
              '9月', '10月', '11月', '12月'
            ]
          },
          yAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          series: [
            {
              name: 'A',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90, 230, 210, 220, 182, 191, 234, 290, 330]
            },
            {
              name: 'B',
              type: 'line',
              stack: '总量',
              data: [220, 182, 191, 234, 290, 330, 310, 150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: 'C',
              type: 'line',
              stack: '总量',
              data: [150, 232, 201, 154, 190, 330, 410, 320, 332, 301, 334, 390, 330, 320]
            },
            {
              name: 'D',
              type: 'line',
              stack: '总量',
              data: [320, 332, 301, 334, 390, 330, 320, 120, 132, 101, 134, 90, 230, 210]
            }
          ]
        }
      }
    },
    created() {
      // this.init()
    },
    methods: {
      /**
       * @author haodongdong
       * @description 部门数据归集统计分析 tab切换按钮回调，设置时间后调用uniteRequest发起需更新的请求
       * @param {Object} dateObj 组件返回一个日期相关的对象
       * @param {string} dateObj.startDateStr 开始时间的日期字符串 默认为yyyy-mm-dd
       * @param {string} dateObj.endDateStr 结束时间的日期字符串 默认为yyyy-mm-dd
       */
      handleTabClick ({ startDateStr, endDateStr }) {
        this.commonDate = [startDateStr, endDateStr]
        this.uniteRequest(this.commonDate)
      },
      /**
       * @author haodongdong
       * @description 部门数据归集统计分析 时间选择器回调，
       * @param {Array} date 组件返回的一个包含开始时间与结束时间字符串的数组，下标0为开始时间，1为结束时间。型式为['yyyy-mm-dd', 'yyyy-mm-dd']
       */
      handleDepartDateChange (date) {
        if (date[0] === '' && date[1] === '') {
          date = this.timeHandler(365, '{y}-{m}-{d}')
          this.tabSelected = 2
        } else {
          this.tabSelected = -1
        }
        this.commonDate = date
        this.uniteRequest(this.commonDate)
      },
      /**
       * @author haodongdong
       * @description 日历组件日期变更事件
       * @param {Object} dateObj 组件返回的一个包含多种日期参数的对象
       * @param {Date} dateObj.date js的标准日期对象
       */
      HandleCalendarChange (date) {
        this.curDate = this.$util.parseTime(date.date, '{y}-{m}-{d}')
        this.query.startDate = this.curDate
        this.getXxgjjl(this.query)
      },
      /**
       * @author haodongdong
       * @description 资源信息分类统计 法人、自然人类别按钮回调，用于切换不同类型的查询。
       */
      handlePersonClassBtn () {
        if (this.query.personClass === 'nat') {
          this.query.personClass = 'leg'
        } else {
          this.query.personClass = 'nat'
        }
        this.getResInfoClassif({
          startDate: this.commonDate[0],
          endDate: this.commonDate[1],
          personClass: this.query.personClass
        })
      },
      /**
       * @author haodongdong
       * @description 资源信息归集趋势 时间选择器回调
       * @param {Array} date 包含开始与结束时间字符串的数组。['yyyy-mm', 'yyyy-mm']
       */
      handleResDateChange (date) {
        if (date[0] === '' && date[1] === '') {
          date = this.timeHandler(365)
          this.resInfoDate = date
        }
        this.getResInfoCollection({
          startDate: date[0],
          endDate: date[1]
        })
      },
      /**
       * @author haodongdong
       * @description 获取t头部磁力块基础数据
       */
      getBaseData() {
      },
      /**
       * @author haodongdong
       * @description 用于初始获取模块内图表数据
       */
      getChartData() {
        // 获取资源信息分类统计
        this.getResInfoClassif({
          startDate: this.commonDate[0],
          endDate: this.commonDate[1],
          personClass: 'nat'
        })
        // 获取资源信息归集趋势
        this.getResInfoCollection({
          startDate: this.resInfoDate[0],
          endDate: this.resInfoDate[1]
        })
      },
      /**
       * @author haodongdong
       * @description 获取资源信息分类统计图表数据
       * @param {Object} query 查询参数对象
       * @param {string} query.startDate 开始时间 yyyy-mm-dd
       * @param {string} query.endDate 结束时间 yyyy-mm-dd
       * @param {string} query.personClass 主体类别，nat 自然人 leg 法人
       */
      async getResInfoClassif (query) {
        // try {
        //   const res = await api.getZyxxfltjsj(query)
        //   this.barChartOption.dataset = formatDataSet({ xField: 'classifyCode', yField: 'count' }, res)
        // } catch (error) {
        //   console.error(error)
        // }
      },
      /**
       * @author haodongdong
       * @description 获取资源信息归集趋势图表数据，会分别请求法人、自然人的趋势数据
       * @param {Object} query 查询参数对象
       * @param {string} query.startDate 开始时间 yyyy-mm
       * @param {string} query.endDate 结束时间 yyyy-mm
       */
      async getResInfoCollection (query) {
        // try {
        //   const [fr, zrr] = await Promise.all([
        //     api.getFrzzxxgjqs(query),
        //     api.getZrpxxgjqs(query)
        //   ])
        //   const source = [
        //     {
        //       legend: '自然人',
        //       data: zrr
        //     },
        //     {
        //       legend: '法人及其他组织',
        //       data: fr
        //     }
        //   ]
        //   const dataset = formatSeries({ xField: 'month', yField: 'count', seriesField: 'legend' }, source)
        //   this.lineSmoothChartOption.dataset = dataset
        // } catch (error) {
        //   console.error(error)
        // }
      },
      /**
       * @author haodongdong
       * @description 时间处理函数，获取某个范围的开始与结束时间的字符串
       * @param {number} 间隔天数
       * @param {string} [mode = {y}-{m}] 返回的时间字符串格式
       * @returns {[startDateStr, endDateStr]}
       */
      timeHandler(days, mode = '{y}-{m}') {
        const { startDateStr, endDateStr } = getTimeRange(days, mode)
        return [startDateStr, endDateStr]
      },
      /**
       * @author haodongdong
       * @description 初始化函数，处理初始时间参数后统一调用数据接口
       */
      async init() {
        // 初始化查询做需要的时间参数
        this.commonDate = this.timeHandler(365, '{y}-{m}-{d}')
        this.resInfoDate = this.timeHandler(365)
        // 获取对应枚举
        // await this.getEnum()
        // 获取初始数据
        this.getBaseData()
        this.getChartData()
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
          display: flex;
          align-items: center;
          width: 19%;
          padding: 20px;
          color: #fff;
          border-radius: 8px;

          .info {
            overflow: hidden;
          }

          .icon {
            background-color: #ffffff44;
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 50px;
            min-height: 50px;
            border-radius: 50%;
            margin-right: 20px;
          }

          .count {
            padding-top: 10px;
            font-size: 22px;
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
    .header-height {
      height: 31.6px;
    }
    .main {
      width: 100%
      height: 100%

      .use-con {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;

        .divider {
          height: 40px;
          width: 1.5px;
          background: #d9d9d9;
        }

        .use-item {
          text-align: center;

          .text {
            font-size: 25px;
            font-weight: 700;
            color: #8c8c8c;
          }
        }
      }
    }
    .card-layout {
      display: flex;
      justify-content: space-between;

      .left {
        width: calc(57% - 10px);
      }
      .right {
        width: calc(43% - 10px);
      }
    }
  }

</style>
